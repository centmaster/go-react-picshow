package main

import (
	"fmt"
	"html/template"
	"net/http"
	"regexp"
	//"time"
	"strings"
	"os"
)

var mux map[string]func(http.ResponseWriter, *http.Request)

type Myhandler struct{}


const (
	Template_Dir = "./view/"
)

func main() {
	//http.HandleFunc("/", hello)
    	http.HandleFunc("/api",index)
    	http.ListenAndServe(":1037", nil)
}

func (*Myhandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if h, ok := mux[r.URL.String()]; ok {
		h(w, r)
		return
	}
	if ok, _ := regexp.MatchString("/css/", r.URL.String()); ok {
		http.StripPrefix("/css/", http.FileServer(http.Dir("./css/"))).ServeHTTP(w, r)
	} else {
		http.StripPrefix("/", http.FileServer(http.Dir("./upload/"))).ServeHTTP(w, r)
	}

}


func index(w http.ResponseWriter, r *http.Request) {
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

