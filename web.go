package main

import (
	"fmt"
	"net/http"
	"html/template"
	"io"
	"strings"
	"os"
	"regexp"
)

var mux map[string]func(http.ResponseWriter, *http.Request)

type Myhandler struct{}

const (
	Template_Dir = "./view/"
)

func main() {
	http.HandleFunc("/", hello)
	http.HandleFunc("/api",showpic)
	http.ListenAndServe(":8000", nil)
}

func hello(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Hello world!")
}



func showpic(w http.ResponseWriter, r *http.Request) {
    r.ParseForm()
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

