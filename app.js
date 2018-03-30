var peopleUrl = "https://swapi.co/api/people/";

new Vue({
    el: "#app",
    data: {
        data: "",
        currPage: 1,
        people: [],
        pages: [],
        peopleUrl: "https://swapi.co/api/people/"
    },
    created() {
        this.getData(this.peopleUrl);
    },
    methods: {
        getData: function(url){
            if(sessionStorage.getItem("page" + this.currPage.toString())){
                console.log("session storage");
                this.data = JSON.parse(sessionStorage.getItem("page" + this.currPage.toString()));
                this.pages = JSON.parse(sessionStorage.getItem("pages"));
                this.initPeople(this.data);
            }
            else{
                var self = this;
                $.get(url, function(data, status){
                    console.log("request to " + url);
                    if(status === "success"){
                        self.data = data;
                        sessionStorage.setItem("page" + self.currPage.toString(), JSON.stringify(data));
                        sessionStorage.setItem("pages", JSON.stringify(self.getPages(data.count)));
                        self.initPeople(data);
                    }
                });
            }
        },
        getPages: function(count){
            var nums = (count / 10) + 1;
            var pages = [];
            for(var i = 1; i <= nums; i++){
                pages.push(i);
            }
            return pages;
        },
        changePage: function(e){
            console.log(e);
            this.currPage = e;
            this.getData(peopleUrl + "?page=" + e.toString());
        },
        initPeople: function(data){
            this.people = [];
            data.results.forEach(element => {
                this.people.push(element);
            });
            if(this.pages.length === 0){
                this.pages = this.getPages(this.data.count);
            }
            if(this.data.prev === null){
                this.currPage = 1;
            }
        }
    },
    watch: {
        data: function(){
            var pageItems = document.querySelectorAll(".pagination > .page-item");
            pageItems.forEach(function(page){
                page.classList.remove("active");
            });
            document.querySelector(".pagination > .page-item:nth-child(" + this.currPage + ")").classList.add("active");
        }
    }
});



