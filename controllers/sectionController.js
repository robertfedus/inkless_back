/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const Section = require('./../models/sectionModel');

exports.getAllSections = (req, res) => {
  return Section.getAllSections(res, sections => {
    return res.status(200).json({
      status: 'success',
      data: {
        sections
      }
    });
  });
};
