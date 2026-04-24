package com.placement.portal.repository;

import com.placement.portal.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByIdDesc(Long userId);
    List<Notification> findByUserIdIsNullOrderByIdDesc(); // Broadcast notifications
}
