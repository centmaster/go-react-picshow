package main

import (
	"fmt"
	"html/template"
	//"io"
	"net/http"
	"os"
	//"path"
	"regexp"
	"time"
	"strings"
)

var mux map[string]func(http.ResponseWriter, *http.Request)

type Myhandler struct{}
type home struct {
	Title string
}

const (
	Template_Dir = "./view/"
)

func main() {
	server := http.Server{
		Addr:        ":1037",
		Handler:     &Myhandler{},
		ReadTimeout: 10 * time.Second,
	}
	mux = make(map[string]func(http.ResponseWriter, *http.Request))
	mux["/"] = index
	mux["/showpic"] = showpic
	server.ListenAndServe()
}

func (*Myhandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if h, ok := mux[r.URL.String()]; ok {
		h(w, r)
		return
	}
	if ok, _ := regexp.MatchString("/css/", r.URL.String()); ok {
		http.StripPrefix("/css/", http.FileServer(http.Dir("./css/"))).ServeHTTP(w, r)
	} else {
		http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))).ServeHTTP(w, r)
	}

}


func index(w http.ResponseWriter, r *http.Request) {
	title := home{Title: "首页"}
	t, _ := template.ParseFiles(Template_Dir + "index.html")
	t.Execute(w, title)
}


func showpic(w http.ResponseWriter, r *http.Request) {
    fmt.Println("path",r.URL.Path)
    	for k, v := range r.Form {
                fmt.Println("key:", k)
                fmt.Println("val:", strings.Join(v, ""))
                if k=="delete"&&v!=nil {
                    os.Remove("./upload/"+strings.Join(v, "")+".jpg")
                }
            }
        t, _ := template.ParseFiles(Template_Dir+"show.html")
        t.Execute(w,nil)

}


