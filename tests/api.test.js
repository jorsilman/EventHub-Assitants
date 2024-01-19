const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const assistant = require("../models/assistant");

describe("Assistant API", () => {
  describe("GET /", () => {
    it("should return an HTML document", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.type).toEqual(expect.stringContaining("html"));
    });
  });
  describe("GET /api/v1/assistants", () => {
    it("should return a list of assistans", async () => {
      const response = await request(app).get("/api/v1/assistants");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
  describe("POST /assistants", () => {
    it("should create a new assistant", async () => {
      const assistantData = {
        name: "Test assistant",
        surname: "Test surname",
        email: "prueba@gmail.com",
        eventId: "1",
        username: "prueba",
        
      };
      const response = await request(app)
      .post("/api/v1/assistants")
      .send(assistantData);

      expect(response.status).toBe(201);
    });
    it("should return 400 for incomplete assistant data", async () => {
        const incompleteAssistantData = {
            // Missing 'name' field intentionally
            surname: "Test surname",
            email: "prueba@gmail.com",
            assistantId: "1",
            username: "prueba",
          
        };
  
        const response = await request(app)
          .post("/api/v1/assistants")
          .send(incompleteAssistantData);
  
        expect(response.status).toBe(400);
      });
    });

    describe("PUT /api/v1/assistants/name/:name", () => {
      it("should update an existing assistant by name", async () => {
        const assistantNameToUpdate = "TestAssistant";
        
        // Crea un asistente para ser actualizado
        const assistantToUpdate = new assistant({
          name: assistantNameToUpdate,
          surname: "TestSurname",
          email: "prueba@gmail.com",
          eventId: "1",
          username: "prueba",
          code: "a123"
        });
    
        await assistantToUpdate.save();
    
        const updatedAssistantData = {
          name: "UpdatedAssistant",
          surname: "UpdatedSurname",
          email: "updated@gmail.com",
          eventId: "2",
          username: "updated",
          code: "a123"
        };
    
        const response = await request(app)
          .put(`/api/v1/assistants/name/${assistantNameToUpdate}`)
          .send(updatedAssistantData);
    
        expect(response.status).toBe(204);
    
        // Verifica que los datos del asistente realmente se actualizaron en la base de datos
        const updatedAssistant = await assistant.findOne({ name: "UpdatedAssistant" });
        expect(updatedAssistant).not.toBeNull();
        expect(updatedAssistant.surname).toBe("UpdatedSurname");
        expect(updatedAssistant.email).toBe("updated@gmail.com");
        expect(updatedAssistant.eventId).toBe("2");
        expect(updatedAssistant.username).toBe("updated");
        expect(updatedAssistant.code).toBe("a123");
      });
    
      it("should return 404 for updating a non-existing assistant by name", async () => {
        const nonExistingAssistantName = "NonExistingAssistant";
        const updatedAssistantData = {
          name: "UpdatedAssistant",
          surname: "UpdatedSurname",
          email: "updated@gmail.com",
          eventId: "2",
          username: "updated",
          code:"a123",
        };
    
        const response = await request(app)
          .put(`/api/v1/assistants/name/${nonExistingAssistantName}`)
          .send(updatedAssistantData);
    
        expect(response.status).toBe(404);
        expect(response.body.error).toBeUndefined();
      });
    });
    describe("PUT /api/v1/assistants/:id", () => {
      it("should update an existing assistant by id", async () => {
        // Crea un asistente para ser actualizado
        const assistantToUpdate = new assistant({
          name: "TestAssistant",
          surname: "TestSurname",
          email: "prueba@gmail.com",
          eventId: "1",
          username: "prueba",
          code: "a123"
        });
    
        await assistantToUpdate.save();
    
        const updatedAssistantData = {
          name: "UpdatedAssistant",
          surname: "UpdatedSurname",
          email: "updated@gmail.com",
          eventId: "2",
          username: "updated",
          code: "a123"
        };
    
        const response = await request(app)
          .put(`/api/v1/assistants/${assistantToUpdate._id}`)
          .send(updatedAssistantData);
    
        expect(response.status).toBe(204);
    
        // Verifica que los datos del asistente realmente se actualizaron en la base de datos
        const updatedAssistant = await assistant.findById(assistantToUpdate._id);
        expect(updatedAssistant).not.toBeNull();
        expect(updatedAssistant.name).toBe("UpdatedAssistant");
        expect(updatedAssistant.surname).toBe("UpdatedSurname");
        expect(updatedAssistant.email).toBe("updated@gmail.com");
        expect(updatedAssistant.eventId).toBe("2");
        expect(updatedAssistant.username).toBe("updated");
        expect(updatedAssistant.code).toBe("a123");
      });
    
      it("should return 404 for updating a non-existing assistant by id", async () => {
        const nonExistingAssistantId = "0000"; // Reemplaza con un ID que no exista
        const updatedAssistantData = {
          name: "UpdatedAssistant",
          surname: "UpdatedSurname",
          email: "updated@gmail.com",
          eventId: "2",
          username: "updated",
          code: "a123"
        };
    
        const response = await request(app)
          .put(`/api/v1/assistants/${nonExistingAssistantId}`)
          .send(updatedAssistantData);
    
        expect(response.status).toBe(404);
        expect(response.body.error).toBeUndefined();
      });
    });
    
    
    describe("DELETE /api/v1/assistants/:id", () => {
      it("should delete an existing assistant by ID", async () => {
        // Crea un asistente para ser eliminado
        const assistantToDelete = new assistant({
          name: "TestAssistantToDelete",
          surname: "TestSurname",
          email: "prueba@gmail.com",
          eventId: "1",
          username: "prueba",
          code: "a234a",
        });
    
        await assistantToDelete.save();
    
        const response = await request(app).delete(
          `/api/v1/assistants/${assistantToDelete._id}`
        );
    
        expect(response.status).toBe(204);
    
        // Verifica que el asistente realmente se eliminó de la base de datos
        const deletedAssistant = await assistant.findOne({
          _id: assistantToDelete._id,
        });
        expect(deletedAssistant).toBeNull();
      });
    
      it("should return 404 for deleting a non-existing assistant by ID", async () => {
        const nonExistingAssistantId = "non-existing-id"; // ID que no existe
    
        const response = await request(app).delete(
          `/api/v1/assistants/${nonExistingAssistantId}`
        );
    
        expect(response.status).toBe(500);
      });
    
      it("should return 500 for server error during deletion", async () => {
        // Mockear el método findOneAndDelete para forzar un error durante la eliminación
        jest.spyOn(assistant, "findOneAndDelete").mockImplementation(() => {
          throw new Error("Mocked error during deletion");
        });
    
        const existingAssistantId = "existing-id"; // ID de un asistente existente
    
        const response = await request(app).delete(
          `/api/v1/assistants/${existingAssistantId}`
        );
    
        expect(response.status).toBe(500);
    
        // Restaurar la implementación original del método después de la prueba
        jest.spyOn(assistant, "findOneAndDelete").mockRestore();
      });
    });

});