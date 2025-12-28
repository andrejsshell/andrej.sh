package books

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type BookStats struct {
	Title            string
	Author           string
	Progress         float64
	Pages            int
	CurrentPage      int
	Status           string
	LastRead         time.Time
	Started          time.Time
	Finished         time.Time
	TotalReadingTime int
}

type ReadingStats struct {
	CurrentBooks     []BookStats
	FinishedBooks    []BookStats
	TotalBooks       int
	TotalPagesRead   int
	TotalReadingTime int
	BooksThisYear    int
}

const MinutesPerPage = 1.25

func LoadBooksFromMarkdown() (*ReadingStats, error) {
	stats := &ReadingStats{
		CurrentBooks:  []BookStats{},
		FinishedBooks: []BookStats{},
	}

	currentYear := time.Now().Year()

	readingDir := "content/books/reading"
	if _, err := os.Stat(readingDir); err == nil {
		files, err := os.ReadDir(readingDir)
		if err != nil {
			return nil, fmt.Errorf("failed to read reading directory: %w", err)
		}

		for _, file := range files {
			if filepath.Ext(file.Name()) != ".md" {
				continue
			}

			book, err := parseBookFile(filepath.Join(readingDir, file.Name()))
			if err != nil {
				continue
			}

			book.Status = "reading"
			stats.CurrentBooks = append(stats.CurrentBooks, book)
			stats.TotalBooks++
			stats.TotalPagesRead += book.CurrentPage
			stats.TotalReadingTime += book.TotalReadingTime
		}
	}

	finishedDir := "content/books/finished"
	if _, err := os.Stat(finishedDir); err == nil {
		files, err := os.ReadDir(finishedDir)
		if err != nil {
			return nil, fmt.Errorf("failed to read finished directory: %w", err)
		}

		for _, file := range files {
			if filepath.Ext(file.Name()) != ".md" {
				continue
			}

			book, err := parseBookFile(filepath.Join(finishedDir, file.Name()))
			if err != nil {
				continue
			}

			book.Status = "finished"
			book.Progress = 100
			stats.FinishedBooks = append(stats.FinishedBooks, book)
			stats.TotalBooks++
			stats.TotalPagesRead += book.CurrentPage
			stats.TotalReadingTime += book.TotalReadingTime

			if book.Finished.Year() == currentYear {
				stats.BooksThisYear++
			}
		}
	}

	sort.Slice(stats.CurrentBooks, func(i, j int) bool {
		return stats.CurrentBooks[i].LastRead.After(stats.CurrentBooks[j].LastRead)
	})

	sort.Slice(stats.FinishedBooks, func(i, j int) bool {
		return stats.FinishedBooks[i].Finished.After(stats.FinishedBooks[j].Finished)
	})

	return stats, nil
}

func parseBookFile(filePath string) (BookStats, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return BookStats{}, err
	}

	parts := strings.SplitN(string(content), "---", 3)
	if len(parts) < 3 {
		return BookStats{}, fmt.Errorf("invalid frontmatter format in %s", filePath)
	}

	frontmatter := parts[1]
	book := BookStats{}

	lines := strings.Split(frontmatter, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		colonIdx := strings.Index(line, ":")
		if colonIdx == -1 {
			continue
		}

		key := strings.TrimSpace(line[:colonIdx])
		value := strings.TrimSpace(line[colonIdx+1:])
		value = strings.Trim(value, "\"")

		switch key {
		case "title":
			book.Title = value
		case "author":
			book.Author = value
		case "pages":
			fmt.Sscanf(value, "%d", &book.Pages)
		case "current_page":
			fmt.Sscanf(value, "%d", &book.CurrentPage)
		case "started":
			if t, err := time.Parse("2006-01-02", value); err == nil {
				book.Started = t
			}
		case "last_updated":
			if t, err := time.Parse("2006-01-02", value); err == nil {
				book.LastRead = t
			}
		case "finished":
			if t, err := time.Parse("2006-01-02", value); err == nil {
				book.Finished = t
			}
		}
	}

	if book.Pages > 0 {
		book.Progress = (float64(book.CurrentPage) / float64(book.Pages)) * 100
		if book.Progress > 100 {
			book.Progress = 100
		}
	}

	book.TotalReadingTime = int(float64(book.CurrentPage) * MinutesPerPage)

	return book, nil
}
