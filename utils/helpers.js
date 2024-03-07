// import fs from "fs";
import fs from "fs/promises"; // Using fs.promises for asynchronous file operations
import persons from "../persons.js";

const currentDate = new Date();
const formattedDate = currentDate.toLocaleString("en-US", {
  weekday: "short", // Short day of the week
  year: "numeric", // Four-digit year
  month: "short", // Short month name
  day: "numeric", // Day of the month
  hour: "numeric", // Hour (24-hour clock)
  minute: "numeric", // Minutes
  second: "numeric", // Seconds
  timeZoneName: "short", // Short time zone name
});

// Function to delete an item from the array

const filePath =
  "/Users/kunleadesokan/WebDev/FullstackOpen/backend/Part3/persons.js";

// Function to delete an item from the array
const deleteItem = async (itemId) => {
  try {
    // Find the index of the item with the specified id
    const index = persons.findIndex((item) => item.id === itemId);

    // If the item is found, remove it from the array
    if (index !== -1) {
      persons.splice(index, 1);

      // Write the updated array back to the file
      await fs.writeFile(
        filePath,
        `export default ${JSON.stringify(persons, null, 2)};`,
        "utf8"
      );
    } else {
      console.log("Item not found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to add an item from the array
const addItem = async (data) => {
  try {
    const newPerson = data;

    newPerson.id =
      persons.length > 0 ? Math.max(...persons.map((p) => p.id)) + 1 : 0;

    // Add the new person to the array
    persons.push(newPerson);

    // Write the updated array back to the file
    await fs.writeFile(
      filePath,
      `export default ${JSON.stringify(persons, null, 2)};`,
      "utf8"
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((p) => p.id)) + 1 : 0;
  return maxId;
};

export { formattedDate, deleteItem, addItem };
