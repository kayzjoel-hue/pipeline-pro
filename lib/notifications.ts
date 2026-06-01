import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

export async function scheduleFollowUpNotification(
  followUpId: string,
  jobCompany: string,
  followUpTitle: string,
  dueDate: string,
  dueTime?: string
) {
  try {
    const scheduledDate = new Date(`${dueDate}T${dueTime || '09:00'}`);

    // Don't schedule if the time is in the past
    if (scheduledDate <= new Date()) {
      console.warn('Cannot schedule notification for past date');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Follow-up: ${jobCompany}`,
        body: followUpTitle,
        data: {
          followUpId,
          jobCompany,
        },
        badge: 1,
        sound: 'default',
      },
      trigger: {
        type: 'timeInterval',
        seconds: Math.floor((scheduledDate.getTime() - Date.now()) / 1000),
      } as any,
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

export async function cancelNotification(notificationId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

export function subscribeToNotifications(
  callback: (notification: Notifications.Notification) => void
) {
  const subscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      callback(notification);
    }
  );

  return () => subscription.remove();
}

export async function getScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}
