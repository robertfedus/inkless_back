/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const db = require('../db/index');
const serverError = require('../utils/serverError');

exports.sendMessage = async (res, senderPublicId, receiverPublicId, message, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      INSERT INTO messages(sender_user_id, receiver_user_id, message)
      VALUES(
        (SELECT id FROM users WHERE public_id=$1),
        (SELECT id FROM users WHERE public_id=$2),
        $3
      )
    `;

    // senderPublicId si receiverPublicId se refera la users.id
    queryArray = [senderPublicId, receiverPublicId, message];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllMessagesForSender = async (res, senderPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT messages.public_id, time, message, users.first_name AS receiver_first_name, users.last_name AS receiver_last_name
      FROM messages
      INNER JOIN users ON (users.id=messages.receiver_user_id)
      WHERE sender_user_id=(
        SELECT id FROM users WHERE public_id=$1
      )
    `;

    queryArray = [senderPublicId];

    const messages = await db.query(queryString, queryArray);

    callback(messages.rows);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.deleteMessage = async (res, messagePublicId, senderPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      DELETE FROM messages
      WHERE public_id=$1
      AND sender_user_id=(
        SELECT id FROM users WHERE public_id=$2
      )
    `;

    queryArray = [messagePublicId, senderPublicId];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

// Mai jos se gaseste implementarea initiala a modelului de mesaje

// exports.sendMessage = async (res, type, targets, message, senderPublicId, callback) => {
//   try {
//     // targets se refera la un array de clase sau elevi (public_id) unde se trimite mesajul.
//     let targetTable = '',
//       targetColumn = '',
//       targetIdSelection = '';
//     // targetColumn e coloana ce difera intre tabelele messages_classes si messages_students.
//     // targetIdSelection se refera la query-ul de gasire a id-ului clasei/elevului

//     switch (type) {
//       case 'classes':
//         targetTable += 'messages_classes';
//         targetColumn += 'class_id';
//         targetIdSelection += `(SELECT id FROM classes WHERE public_id=$2)`;
//         break;
//       case 'students':
//         targetTable += 'messages_students';
//         targetColumn += 'student_id';
//         targetIdSelection += `(SELECT id FROM students WHERE user_id=(SELECT id FROM users WHERE public_id=$2))`;
//         break;
//       default:
//         throw new Error(`Message type ${type} does not exist.`);
//     }
//     let queryString, queryArray;

//     queryString = `
//       INSERT INTO messages(sender_user_id, message)
//       VALUES((SELECT id FROM users WHERE public_id=$1), $2)
//       RETURNING id
//     `;

//     queryArray = [senderPublicId, message];

//     const queryMessage = await db.query(queryString, queryArray);
//     const messageId = queryMessage.rows[0].id;

//     queryString = `
//       INSERT INTO ${targetTable}(message_id, ${targetColumn})
//       VALUES($1, ${targetIdSelection})
//     `;

//     for (const target of targets) {
//       await db.query(queryString, [messageId, target]);
//     }

//     callback();
//   } catch (err) {
//     return serverError(res, err);
//   }
// };

// exports.deleteMessage = async (res, messagePublicId, callback) => {
//   try {
//     let queryString, queryArray;

//     // Aici verificam daca mesajul se gaseste in messages_classes
//     queryString = `
//       SELECT messages_classes.id AS messages_classes_id, messages.id AS message_id
//       FROM messages_classes
//       INNER JOIN messages ON (messages.id=messages_classes.message_id)
//       WHERE messages.public_id=$1
//     `;
//     queryArray = [messagePublicId];
//     const messagesClassesResult = await db.query(queryString, queryArray);

//     // Aici verificam daca mesajul se gaseste in messages_students
//     queryString = `
//       SELECT messages_students.id AS messages_students_id, messages.id AS message_id
//       FROM messages_students
//       INNER JOIN messages ON (messages.id=messages_students.message_id)
//       WHERE messages.public_id=$1
//     `;
//     const messagesStudentsResult = await db.query(queryString, queryArray);

//     if (messagesClassesResult.rows) {
//       queryString = `
//         DELETE FROM messages_classes
//         WHERE message_id=$1 AND id=$2
//       `;

//       for (const row of messagesClassesResult.rows) {
//         await db.query(queryString, [row.message_id, row.messages_classes_id]);
//       }
//     }

//     if (messagesStudentsResult.rows) {
//       queryString = `
//         DELETE FROM messages_students
//         WHERE message_id=$1 AND id=$2
//       `;

//       for (const row of messagesStudentsResult.rows) {
//         await db.query(queryString, [row.message_id, row.messages_students_id]);
//       }
//     }

//     queryString = `
//       DELETE FROM messages
//       WHERE public_id=$1
//     `;

//     await db.query(queryString, queryArray);

//     callback();
//   } catch (err) {
//     return serverError(res, err);
//   }
// };

// exports.getAllMessagesForSender = async (res, senderPublicId, callback) => {
//   try {
//     let queryString, queryArray;

//     // Aici luam mesajul din tabelul messages
//     queryString = `
//       SELECT message, time, id FROM messages
//       WHERE sender_user_id=(
//         SELECT id FROM users WHERE public_id=$1
//       )
//       ORDER BY time
//     `;

//     queryArray = [senderPublicId];

//     const dbMessages = await db.query(queryString, queryArray);
//     const messages = [];

//     for (const message of dbMessages.rows) {
//       const messageObj = {
//         message: message.message,
//         time: message.time,
//         received_by: {}
//       };

//       // queryArray = [message.id];

//       // Aici verificam daca mesajul se gaseste in tabelul messages_classes si luam clasele la care a fost trimis

//       let query, arr;

//       query = `
//         SELECT classes.grade, classes.letter
//         FROM messages_classes
//         INNER JOIN classes ON (classes.id=messages_classes.class_id)
//         WHERE message_id=$1
//         ORDER BY grade
//       `;

//       arr = [message.id];

//       let result = await db.query(query, arr);

//       messageObj.received_by.classes = result.rows;

//       // Aici verificam daca mesajul se gaseste in tabelul messages_students si luam elevii la care a fost trimis

//       query = `
//         SELECT users.first_name, users.last_name, classes.letter AS class_letter, classes.grade AS grade
//         FROM messages_students
//         INNER JOIN students ON (students.id=messages_students.student_id)
//         INNER JOIN users ON (students.user_id=users.id)
//         INNER JOIN classes ON (classes.id=students.class_id)
//         WHERE message_id=$1
//       `;

//       result = await db.query(query, arr);

//       messageObj.received_by.students = result.rows;

//       messages.push(messageObj);
//     }

//     callback(messages);
//   } catch (err) {
//     return serverError(res, err);
//   }
// };
