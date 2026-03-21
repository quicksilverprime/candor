import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NOTIFICATION_COPY = {
  spark: [
    "A question that'll wake you up better than coffee.",
    "Today's spark is ready. Go light something.",
    "Curiosity is calling. Open Candor.",
  ],
  mirror: [
    "Today's question asks something quiet of you.",
    "A moment of truth is waiting.",
    "Some questions are worth sitting with.",
  ],
  gauntlet: [
    "Today's question won't let you off easy.",
    "Something uncomfortable is waiting. Good.",
    "The gauntlet is set. Are you?",
  ],
  bridge: [
    "One question. One real conversation. That's all it takes.",
    "Today's question builds something between people.",
    "Connection starts with one honest ask.",
  ],
  horizon: [
    "Your future is asking you something today.",
    "Today's question points forward. Open it.",
    "Clarity is waiting. One question away.",
  ],
};

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications only work on a real device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission not granted');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return true;
}

export async function scheduleDailyNotification(questionType?: string) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const type = (questionType as keyof typeof NOTIFICATION_COPY) || 'bridge';
  const copies = NOTIFICATION_COPY[type] || NOTIFICATION_COPY.bridge;
  const body = copies[Math.floor(Math.random() * copies.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'candor',
      body,
      data: { questionType: type },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 30,
    },
  });
}