package handlers

import (
	"html/template"
	"log"
	"net/http"

	"andrej.sh/pkg/books"
)

func Books(w http.ResponseWriter, r *http.Request, templates *template.Template) {
	log.Println("Loading books from markdown files...")
	readingStats, err := books.LoadBooksFromMarkdown()
	if err != nil {
		log.Printf("Warning: Failed to load books: %v", err)
		readingStats = &books.ReadingStats{
			CurrentBooks:  []books.BookStats{},
			FinishedBooks: []books.BookStats{},
		}
	} else {
		log.Printf("✓ Loaded %d books", readingStats.TotalBooks)
	}

	data := struct {
		ReadingStats *books.ReadingStats
	}{
		ReadingStats: readingStats,
	}
	templates.ExecuteTemplate(w, "books.html", data)
}
