const axios = require("axios");

class BasePlatform {
  constructor(messageType) {
    this.messageType = messageType;
    this.data = null;
    this.sendURL = null;
  }

  generateMessage(payload) {
    const messageDataHandler = `get${this.messageType}`;

    if (this.messageType && Object.getPrototypeOf(this).hasOwnProperty(messageDataHandler)) {
      this.data = this[messageDataHandler](payload);
    }

    return this;
  }

  get isValid() {
    return this.sendURL && this.data;
  }

  async send() {
    if (!this.isValid) {
      console.error("no send url or no payload");
      return false;
    }

    const options = {
      method: "post",
      url: this.sendURL,
      headers: {
        "Content-Type": "application/json",
      },
      data: this.data,
    };
    const response = await axios.request(options);

    return response.status === 200;
  }
}

module.exports = BasePlatform;
