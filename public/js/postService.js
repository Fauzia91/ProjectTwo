class PostService {
    constructor(route) {
        this.route = route

    }

    async createPost(data){
        const response = await fetch("/api/post", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        })
        console.log("Post Created",response)
        return response
    }

    async getPostByDate(date){
        const response = await fetch(`/api/post?date=${date}`, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        console.log("got data",data)
        return {data: data.today, week: data.week};
    }

    async updatePost(data, id){
        const response = await fetch(`/api/post/${id}`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response
    }

    async togglePost(toggle, id){
        const response = await fetch(`/api/post/toggle/${id}`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify({
                complete: !toggle
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response
    }
    async deletePost(id){
        const response = await fetch(`/api/post/${id}`, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json"
            }
        })

        return response;
    }

}