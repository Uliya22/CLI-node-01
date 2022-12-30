const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve(__dirname, "./db/contacts.json");
const colors = require("colors");

async function readDb() {
  const data = await fs.readFile(contactsPath, "utf8");
  db = JSON.parse(data);
  return db;
}

const updateContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

function createId(data) {
  const arrId = data.map((item) => item.id);
  let max = 0;
  for (id of arrId) {
    if (id > max) {
      max = Number(id);
    }
  }
  return String(max + 1);
}

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

    if (
      contacts.find(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
      )
    )
      throw new Error("This name already exists!");

    if (contacts.find((contact) => contact.email === email))
      throw new Error("This email already exists!");

    if (contacts.find((contact) => contact.phone === phone))
      throw new Error("This phone already exists!");

    const id = createId(contacts);
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
