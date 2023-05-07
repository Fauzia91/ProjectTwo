// user posts to blog

const router = require('express').Router();
const { Post } = require('../models');
const sequelize = require("../config/connection");
const dayjs = require('dayjs')


router.post('/', async (req, res)=> {

    try{
        const result = await Post.create({

            title: req.body.title,

            date: req.body.date
        });

        res.json(result)

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }
});


//GET route to display all blog posts
router.get('/', async (req, res)=> {


    try {

        if(req.query.date){
            console.log("alot==========")
            const week = [];
            const todayObj = dayjs(req.query.date);
            const z = todayObj.subtract(3, 'day')
            const y = todayObj.subtract(2, 'day')
            const x = todayObj.subtract(1, 'day')
            const today = todayObj
            const a = todayObj.add(1, 'day')
            const b = todayObj.add(2, 'day')
            const c = todayObj.add(3, 'day')

            let tempArray = [z,y,x,today,a,b,c];
            for( element of tempArray){
                week.push({
                    date:element.format('YYYY-MM-DD'),
                    dateFormmatted: element.format("ddd")
                });
            }

             const result = await  Post.findAll({
                    where: sequelize.where(sequelize.fn('date', sequelize.col('date')), '=', req.query.date)
                })


            for (const element of week) {
                element.complete = element.incomplete = element.total = 0;
                const tempR = await Post.findAll({
                    where: sequelize.where(sequelize.fn('date', sequelize.col('date')), '=', element.date),
                    raw: true
                })

                for(const el of tempR ){
                    if(el.complete){ element.complete++} else {element.incomplete++}
                    element.total++
                }

            }
            //console.log(week)
            res.json({
                today: result,
                week: week
            });


        } else {
            const result = await Post.findAll();
            res.json(result);

        }


    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});
router.put('/toggle/:id', async (req, res)=> {
    console.log("put request", req.params.id, req.body.complete)

    try {


        const result = await Post.update({
            complete: req.body.complete
        },{
            where: {id: req.params.id}
        });

        res.json(result);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});

router.get('/:id', async (req, res)=> {

    try {

        const result = await Post.findOne({

            where: {id: req.params.id},
            raw: true
        });
        res.json(result);

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }

});



router.put('/:id', async (req, res)=> {
    console.log("put request", req.params.id, req.body)

    try {

        const result = await Post.update({

            title: req.body.title,



        },{
            where: {id: req.params.id}
        });

        res.json(result);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});



router.delete('/:id', async (req, res)=> {
    console.log("delete", req.params.id)

    try {

        const result = await Post.destroy({
            where: {id: req.params.id},
            raw: true
        });

        res.json(result);
 

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }

});



module.exports = router;











