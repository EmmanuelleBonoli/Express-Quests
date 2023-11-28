const request = require("supertest");
const crypto = require("node:crypto");

const app = require("../src/app");
const database = require("../database");

afterAll(() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request(app).post("/api/users").send(newUser);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");
    expect(typeof response.body.firstname).toBe("string");
    expect(typeof response.body.lastname).toBe("string");
    expect(typeof response.body.email).toBe("string");
    expect(typeof response.body.city).toBe("string");
    expect(typeof response.body.language).toBe("string");

    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );
    const [userInDatabase] = result;

    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase).toHaveProperty("language");
   });

   it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Harry" };
    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);
      expect(response.status).toEqual(422);
  });
  });

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "Fred",
      lastname: "Benjamin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Bordeaux",
      language: "italian"
    };

    const [insertResult] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = insertResult.insertId;

    const updatedUser = {
      firstname: "Valeriy",
      lastname: "Appius",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Bruxelles",
      language: "Russian"
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response.status).toEqual(204);


    
    const [selectResult] = await database.query(
      "SELECT * FROM users WHERE id=?",
      id
    );

    const [userInDatabase] = selectResult;

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(updatedUser.firstname);

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(updatedUser.lastname);

    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(updatedUser.email);

    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(updatedUser.city);

    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(updatedUser.language);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "John" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

      expect(response.status).toEqual(422);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Albertus",
      lastname: "Gontran",
      email: "albertus.gontran@example.com",
      city: "Marseille",
      language: "Spanish"
    };

    const response = await request(app).put("/api/users/0").send(newUser);
    expect(response.status).toEqual(404);
  });
});

describe("DELETTE /api/users/:id", () => {
  it("should remove user", async () => {
    const newUser = {
      firstname: "Joe",
      lastname: "GY",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };
    const [result2] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [newUser.firstname, newUser.lastname, newUser.email, newUser.city, newUser.language]
    );
    const id = result2.insertId;
    const response = await request(app)
      .delete(`/api/users/${id}`)
      .send("Delete done");
    expect(response.status).toEqual(204);
  });
  it("should fail because no ID valid", async () => {
    const response = await request(app)
    .delete(`/api/users/5000`)
    expect(response.status).toEqual(404);
  })
});











