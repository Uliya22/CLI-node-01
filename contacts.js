const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve(__dirname, "./db/contacts.json");
const { v4: uuidv4 } = require("uuid");
const colors = require("colors");

async function readDb() {
  const data = await fs.readFile(contactsPath, "utf8");
  db = JSON.parse(data);
  return db;
}

const updateContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

async function listContacts() {
  try {
    const data = await readDb();
    console.table(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await readDb();
    const contact = contacts.find((contact) => contact.id === contactId);
   
    if (contact) {
      console.log(`Contact with such id = ${contactId} was found!`.green);
      console.table(contact);
    } else {
      console.log(`Contact with such id = ${contactId} was not found!`.red);
    }
    return contact;
  } catch (error) {
    console.error(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await readDb();
    const contactByName = contacts.find(
      (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );
    const contactByMail = contacts.find((contact) => contact.email === email);
    const contactByPhone = contacts.find((contact) => contact.phone === phone);

    if (contactByName) 
      throw new Error("This name already exists!");

    if (contactByMail)
      throw new Error("This email already exists!");

    if (contactByPhone)
      throw new Error("This phone already exists!");

    const id = uuidv4();
    const newContact = { id, name, email, phone };
    contacts.push(newContact);

    updateContacts(contacts);
    console.log(`Contact with id=${id} is added`.green);
    console.table(newContact);
  } catch (error) {
    console.error(error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await readDb();

    const idContact = contacts.findIndex((contact) => contact.id === contactId);
    if (idContact === -1) {
      return console.log(`Contact with id=${contactId} not found!!!`.red);
    }

    const contactDelete = contacts.splice(idContact, 1);

    updateContacts(contacts);
    console.log(`Contact with id=${contactId} is removed`.green);
    console.table(contactDelete);

    return contactDelete;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
