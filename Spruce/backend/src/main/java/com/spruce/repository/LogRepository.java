package com.spruce.repository;

import com.spruce.model.LogEntry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<LogEntry, Long> {

    @Query("SELECT l FROM LogEntry l ORDER BY l.id DESC")
    List<LogEntry> findRecent(Pageable pageable);
}










