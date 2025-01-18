package utils

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

// CopyFolder recursively copies a source folder to a destination folder.
func CopyFolder(src string, dst string) error {
	fmt.Println(src, dst)
	// Ensure the source folder exists
	srcInfo, err := os.Stat(src)
	if err != nil {
		return fmt.Errorf("failed to access source: %w", err)
	}
	if !srcInfo.IsDir() {
		return fmt.Errorf("source is not a directory")
	}

	// Create the destination folder
	err = os.MkdirAll(dst, srcInfo.Mode())
	if err != nil {
		return fmt.Errorf("failed to create destination: %w", err)
	}

	// Walk through the source folder
	err = filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return fmt.Errorf("error accessing path %q: %w", path, err)
		}

		// Create the relative path for the destination
		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return fmt.Errorf("failed to get relative path: %w", err)
		}
		destPath := filepath.Join(dst, relPath)

		if info.IsDir() {
			// Create the directory in the destination
			return os.MkdirAll(destPath, info.Mode())
		}

		// Copy the file
		return copyFile(path, destPath, info)
	})

	return err
}

// copyFile copies a single file from src to dst.
func copyFile(src, dst string, info os.FileInfo) error {
	srcFile, err := os.Open(src)
	if err != nil {
		return fmt.Errorf("failed to open source file: %w", err)
	}
	defer srcFile.Close()

	dstFile, err := os.OpenFile(dst, os.O_CREATE|os.O_WRONLY, info.Mode())
	if err != nil {
		return fmt.Errorf("failed to create destination file: %w", err)
	}
	defer dstFile.Close()

	_, err = io.Copy(dstFile, srcFile)
	if err != nil {
		return fmt.Errorf("failed to copy file content: %w", err)
	}

	return nil
}
