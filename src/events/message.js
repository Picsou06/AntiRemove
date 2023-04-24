const { Event } = require("sheweny");

module.exports = class  extends Event {
  constructor(client) {
    super(client, messageCreate, {
      description: "Reçoit un message dans pseudo",
      once: true,
    });
  }

  execute() {
    console.log("Event called !");
  }
};
