'use strict'

var { reset } = require('nodemon');
var Project = require('../models/projects');
var fs = require('fs');
var path = require('path');

var controller = {

    home: function (req, res) {
        return res.status(200).send({
            message: 'I am a homepage'
        });
    },

    test: function (req, res) {
        return res.status(200).send({
            message: 'I am a test page'
        });
    },

    saveProject: function (req, res) {
        var project = new Project();

        var params = req.body;
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        project.save((err, projectStored) => {
            if (err) return res.status(500).send({
                message: 'Error SaveProject'
            });
            if (!projectStored) return res.status(404).send({
                message: 'Cannot store the project'
            });

            return res.status(200).send({ project: projectStored });
        });
    },
    getProject: function (req, res) {
        var projectId = req.params.id;

        if (projectId == null) return res.status(404).send({
            message: 'Project doesnt exist'
        });


        Project.findById(projectId, (err, project) => {
            if (err) return res.status(500).send({
                message: 'Error getData'
            });
            if (!project) return res.status(404).send({
                message: 'Project doesnt exist'
            });
            return res.status(200).send({ project });
        });
    },

    getProjects: function (req, res) {
        Project.find({}).exec((err, projects) => {
            if (err) return res.status(500).send({
                message: 'Error getData'
            });
            if (!projects) return res.status(404).send({
                message: 'Projects doesnt exist'
            });
            return res.status(200).send({ projects });
        });
    },

    updateProject: function (req, res) {
        var projectId = req.params.id;
        var update = req.body;

        Project.findByIdAndUpdate(projectId, update, { new: true }, (err, projectUpdated) => {
            if (err) return res.status(500).send({ messaage: 'Error by update' });
            if (!projectUpdated) return res.status(404).send({ message: 'project doesnt exist ' });

            return res.status(200).send({ project: projectUpdated });
        });
    },
    deleteProject: function (req, res) {
        var projectId = req.params.id;

        Project.findByIdAndRemove(projectId, (err, projectRemoved) => {
            if (err) return res.status(500).send({ message: 'Cannot delete the project' });

            if (!projectRemoved) return res.status(404).send({ message: "Project not found and cant be deleted" });

            return res.status(200).send({
                project: projectRemoved
            });
        });
    },

    uploadImage: function (req, res) {
        var projectId = req.params.id;
        var fileName = 'Image havent been upload';

        if (req.files) {
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];


            if (fileExt == 'PNG' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {


                Project.findByIdAndUpdate(projectId, { image: fileName }, { new: true }, (err, projectUpdated) => {

                    if (err) return res.status(500).send({ messaage: 'cannot upload' });
                    if (!projectUpdated) return res.status(404).send({ message: 'Image doesnt exist' });

                    return res.status(200).send({
                        project: projectUpdated
                    });
                });
            } else {
                fs.unlink(filePath, (err) => {
                    return res.status(500).send({ menssage: 'Not valid' });
                });
            }
        } else {
            return res.status(200).send({
                massage: fileName
            });
        }
    },

    getImageFile: function (req, res) {
        var file = req.params.image;
        var path_file = './uploads/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(200).send({
                    massage: "Image doesnt exist.."
                });
            }
        });



    }
};
module.exports = controller;
