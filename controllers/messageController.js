/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const Message = require('./../models/messageModel');

exports.sendMessage = (req, res) => {
  const { body } = req;

  return Message.sendMessage(res, body.sender_public_id, body.receiver_public_id, body.message, () => {
    res.status(200).json({
      status: 'success',
      message: 'Mesaj trimis cu succes!'
    });
  });
};

exports.getAllMessagesForSender = (req, res) => {
  const { query } = req;

  return Message.getAllMessagesForSender(res, query.sender_public_id, messages => {
    res.status(200).json({
      status: 'success',
      data: {
        messages
      }
    });
  });
};

exports.deleteMessage = (req, res) => {
  const { query } = req;

  return Message.deleteMessage(res, query.message_public_id, query.sender_public_id, () => {
    res.status(200).json({
      status: 'success',
      message: 'Mesaj sters cu succes!'
    });
  });
};

// Mai jos se gaseste implementarea initiala a controller-ului de mesaje

// exports.sendMessage = (req, res) => {
//   const { query, body } = req;

//   return Message.sendMessage(res, query.type, body.targets, body.message, body.sender_public_id, () => {
//     res.status(200).json({
//       status: 'success',
//       message: 'Mesaj trimis cu succes!'
//     });
//   });
// };

// exports.deleteMessage = (req, res) => {
//   const { query } = req;

//   return Message.deleteMessage(res, query.message_public_id, () => {
//     res.status(200).json({
//       status: 'success',
//       message: 'Mesaj sters cu succes!'
//     });
//   });
// };

// exports.getAllMessagesForSender = (req, res) => {
//   const { query } = req;
//   // query.sender_public_id se refera la user public id!
//   return Message.getAllMessagesForSender(res, query.sender_public_id, messages => {
//     res.status(200).json({
//       status: 'success',
//       data: {
//         messages
//       }
//     });
//   });
// };
