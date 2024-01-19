const Assistant = require('../../models/assistant');
const dbConnect = require('../../db');

jest.setTimeout(30000);

describe('Assistants DB connection', () => {
    beforeAll((done) => {
        if (dbConnect.readyState == 1) {
            done();
        } else {
            dbConnect.on("connected", () => done());
        }
    });

    beforeEach(async () => {
        await Assistant.deleteMany({});
    });

    it('writes a assistant in the DB', async () => {
        const assistant = new Assistant({name: 'Pepito',surname: "Perez", email: "fekir@betis.com",
         eventId: "1", username: "pepepere", code: "123"});
        await assistant.save();
        assistants = await Assistant.find();
        expect(assistants).toBeArrayOfSize(1);
    });

    afterAll(async () => {
        if (dbConnect.readyState == 1) {
            await dbConnect.close();
        }
    });
});