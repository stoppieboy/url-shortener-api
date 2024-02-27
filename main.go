package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type long_url struct {
	Url string
}

func main() {
	// fmt.Println("Hello")

	url_map := make(map[string]string)

	router := mux.NewRouter()

	router.HandleFunc("/create-url", createUrl(url_map)).Methods("POST")
	router.HandleFunc("/{short-url}", getUrl(url_map)).Methods("GET")
	router.HandleFunc("/test/flush-map", flushMap(url_map)).Methods("GET")

	enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))

	log.Fatal(http.ListenAndServe(":3000", enhancedRouter))
}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// set JSON content-type
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow origin
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// check if the request is for CORS preflight
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Pass down the request to the next middleware (or final handler)
		next.ServeHTTP(w, r)
	})
}

func createUrl(url_map map[string]string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var url long_url
		err := json.NewDecoder(r.Body).Decode(&url)
		if err!= nil {
			json.NewEncoder(w).Encode("Invalid URL")
			return
		}
		src_url := url.Url
		
		fmt.Println(src_url)
		var temp string
		if len(src_url) < 5 {
			temp = src_url
		} else {
			temp = src_url[len(src_url)-5:]
		}
		short_url := "tiny" + temp
		fmt.Println(short_url)
		url_map[short_url] = src_url
		json.NewEncoder(w).Encode(short_url)
	}
}

func getUrl(url_map map[string]string) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		short_url := mux.Vars(r)["short-url"]
		long_url, ok := url_map[short_url]
		if ok {
			http.Redirect(w, r, long_url, http.StatusPermanentRedirect)
		} else {
			w.WriteHeader(http.StatusNotFound)
		}
	})
}

func flushMap(url_map map[string]string) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(url_map)
	})
}
