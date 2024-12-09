const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { BadRequestError, NotFoundError } = require("../expressError");

class User {
  /** Register a new user. */
  static async register({ username, password, first_name, last_name, phone }) {
    if (!username || !password) {
      throw new BadRequestError("Username and password are required.");
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    try {
      const result = await db.query(
        `INSERT INTO users 
         (username, password, first_name, last_name, phone, join_at, last_login_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING username, first_name, last_name, phone`,
        [username, hashedPassword, first_name, last_name, phone]
      );

      return result.rows[0];
    } catch (err) {
      if (err.code === "23505") {
        throw new BadRequestError("Username already exists.");
      }
      throw err;
    }
  }

  /** Authenticate user by comparing hashed passwords. */
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT password FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    if (user) {
      return await bcrypt.compare(password, user.password);
    }
    return false;
  }

  /** Update login timestamp for a user. */
  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users 
       SET last_login_at = CURRENT_TIMESTAMP
       WHERE username = $1
       RETURNING username`,
      [username]
    );

    if (!result.rows[0]) {
      throw new NotFoundError(`No such user: ${username}`);
    }
  }

  /** Get all users. */
  static async all() {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone FROM users`
    );
    return result.rows;
  }

  /** Get user details by username. */
  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at
       FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    if (!user) {
      throw new NotFoundError(`No such user: ${username}`);
    }
    return user;
  }

  /** Get messages sent by the user. */
  static async messagesFrom(username) {
    const result = await db.query(
      `SELECT m.id, m.body, m.sent_at, m.read_at, 
              json_build_object('username', u.username, 'first_name', u.first_name, 
              'last_name', u.last_name, 'phone', u.phone) AS to_user
       FROM messages m
       JOIN users u ON m.to_username = u.username
       WHERE m.from_username = $1`,
      [username]
    );
    return result.rows;
  }

  /** Get messages received by the user. */
  static async messagesTo(username) {
    const result = await db.query(
      `SELECT m.id, m.body, m.sent_at, m.read_at, 
              json_build_object('username', u.username, 'first_name', u.first_name, 
              'last_name', u.last_name, 'phone', u.phone) AS from_user
       FROM messages m
       JOIN users u ON m.from_username = u.username
       WHERE m.to_username = $1`,
      [username]
    );
    return result.rows;
  }
}

module.exports = User;
