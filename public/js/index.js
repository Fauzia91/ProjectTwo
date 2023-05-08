let output = document.querySelector("#output");
let targetDate = new Date().toISOString().substr(0, 10);
let postService = new PostService('/api/post/');


console.log("TARGET DATE:", targetDate   )
//output.textContent = "hello world";

async function deleteEntry(id){
    const response = await postService.deletePost(id)
    console.log(response.json())
    buildList(targetDate);
}


async function saveEntry(id){
    let form = document.querySelector(`.box${id}`);
    const response = await postService.updatePost({
        title: form.querySelector('input[name=title]').value,
        date: targetDate
    }, id)

    if(response.ok){
        console.log("updated!")
        buildList(targetDate);
    } else {
        console.log("update fail")
    }

}

function createEditForm(id, title, body){

    let form = document.createElement('form');
    form.setAttribute("method", "put");
    form.setAttribute("action", `/api/post/${id}`)
    let inputTitle = document.createElement('input');
    inputTitle.setAttribute("type", "text")
    inputTitle.setAttribute("name", "title")
    inputTitle.setAttribute("value", title)
    // let inputBody = document.createElement('input');
    // inputBody.setAttribute("type", "text");
    // inputBody.setAttribute("name", "body");
    // inputBody.setAttribute("value", body);
    let targetBox = document.querySelector(`.box${id}`);
    form.appendChild(inputTitle);
    //form.appendChild(inputBody);
    targetBox.insertBefore(form, targetBox.querySelector('*:first-child'));


}
function createIcon(img){
    let key = img.split('.')[0]
    let element = document.createElement('img');
    element.setAttribute("src", `/assets/${img}`);
    element.classList = key + "Btn";
    return element;
}

function buildWeek(week){
    console.log("build week", week);
    document.querySelector("#week").innerHTML = "";
    week.forEach(w=>{
        let dayBox = document.createElement("div");
        let dayTitle = document.createElement("h4")
        dayTitle.textContent = w.dateFormmatted;
        let stat = document.createElement("p");
        stat.textContent = parseInt(w.date.split("-")[1])  + "/" + parseInt(w.date.split("-")[2])
        let circle = document.createElement("span");

        //stat.textContent = w.complete  + "/" + w.total


        //dayBox.setAttribute("data-date", w.date)
        dayBox.appendChild(dayTitle);
        dayBox.appendChild(stat);
        if(w.total === 0){

        } else if(w.total > w.complete){
            circle.classList = "circle-red";
            dayBox.appendChild(circle);

            //add red
        } else if(w.total === w.complete){
            circle.classList = "circle-green";
            dayBox.appendChild(circle)
            //add green
        }
        dayBox.addEventListener("click", ()=>{
            targetDate = w.date
            document.querySelector("#date").value = w.date;
            buildList(w.date);
        })
        document.querySelector("#week").appendChild(dayBox)
    })
}

async function buildList(date){
    console.log("building list with", date)
    output.innerHTML = "";
    const {data,week} = await postService.getPostByDate(date)

    buildWeek(week)

    console.log(data)
    data.forEach(t => {

        let myTitle = document.createElement("h4");
        myTitle.textContent = t.title;
        // let myBody = document.createElement("p");
        // myBody.textContent = t.body;


        let myBox = document.createElement("div");
        console.log(t.complete)
        if(t.complete){
            myBox.classList = `box box${t.id} complete`;
        } else {
            myBox.classList = `box box${t.id}`;
        }

        let circle = document.createElement("span");
        circle.classList = "circle";

        let myControls = document.createElement("div");
        myControls.classList = "controls";

        let deleteIcon = createIcon("delete.jpg")
        deleteIcon.addEventListener("click", (e)=>deleteEntry(t.id));

        let saveIcon = createIcon("save.png")
        saveIcon.addEventListener("click", (e)=>saveEntry(t.id));
        saveIcon.style.display = "none";
        let editIcon = createIcon("edit.png")
        editIcon.addEventListener("click", (e)=>{
            e.target.style.display = "none";
            myBox.querySelector('h4').style.display = "none";
            myBox.querySelector('p').style.display = "none";
            saveIcon.style.display = "block";
            createEditForm(t.id, t.title, t.body);

        });
        myTitle.addEventListener("click", async ()=>{
            const response = await postService.togglePost(t.complete, t.id);
            buildList(targetDate)
        })

        myTitle.appendChild(circle)
        myControls.appendChild(editIcon);
        myControls.appendChild(saveIcon);
        myControls.appendChild(deleteIcon);

        myBox.appendChild(myTitle);
        //myBox.appendChild(myBody);
        myBox.appendChild(myControls);
        output.appendChild(myBox);


    })

}


//submit form
document.querySelector("#addTodoList").addEventListener("submit", async (e) => {
    console.log("create on date",  targetDate);
    e.preventDefault();
    const result = await postService.createPost({
        title: e.target.title.value,
        //body: e.target.body.value,
        date: targetDate
    });
    if(result.ok){
        buildList(targetDate);
    }
    console.log("Add", result)
    e.target.title.value =  ""

});


document.querySelector("#date").value = targetDate;
document.querySelector("#date").addEventListener("change", (e)=>{
    console.log(e.target.value)
    targetDate = e.target.value;
    buildList( targetDate ) //passing the date
})



buildList(targetDate);


