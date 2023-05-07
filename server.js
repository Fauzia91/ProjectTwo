const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');



const postRoutes = require('./controllers/postroutes');
const homeRoutes = require('./controllers/homeroutes');

// added sequelize
const sequelize = require('./config/connection');



const app = express();
const PORT = process.env.PORT || 3000;



const hbs = exphbs.create({

})
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))


// added the postRoutes to the app

app.use('/api/post',postRoutes);
app.use('/', homeRoutes);


app.listen(PORT, ()=> {

  console.log(`app listening on http://localhost:${PORT}`)
  sequelize.sync({ force: false })

});



