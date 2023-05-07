const sequelize = require('../config/connection');
const {  Post } = require('../models');


const postData = require('./postData.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: true });


  for (const post of postData) {
    await Post.create({
      ...post
    });
  }

  process.exit(0);
};

seedDatabase();
