/**
 * Gesture Emoji Utilities
 * Centralized gesture emoji and formatting functions for consistent use across the app
 */

export const GESTURE_EMOJIS = {
  thumb_palm: "✊",
  wave: "👋",
  ok_sign: "👌",
  default: "🤚",
};

export const GESTURE_NAMES = {
  thumb_palm: "Thumb-Palm (Emergency)",
  wave: "Wave Gesture",
  ok_sign: "OK Sign (Distress)",
};

export const GESTURE_COLORS = {
  thumb_palm: {
    text: "text-red-400",
    bg: "bg-red-500",
    border: "border-red-500",
    gradient: "from-red-600 to-red-700",
  },
  wave: {
    text: "text-yellow-400",
    bg: "bg-yellow-500",
    border: "border-yellow-500",
    gradient: "from-yellow-600 to-yellow-700",
  },
  ok_sign: {
    text: "text-orange-400",
    bg: "bg-orange-500",
    border: "border-orange-500",
    gradient: "from-orange-600 to-orange-700",
  },
};

/**
 * Get the emoji for a specific gesture type
 * @param {string} gestureType - The gesture type (thumb_palm, wave, ok_sign)
 * @returns {string} The corresponding emoji
 */
export const getGestureEmoji = (gestureType) => {
  return GESTURE_EMOJIS[gestureType] || GESTURE_EMOJIS.default;
};

/**
 * Get the display name for a specific gesture type
 * @param {string} gestureType - The gesture type
 * @returns {string} The formatted gesture name
 */
export const getGestureName = (gestureType) => {
  return GESTURE_NAMES[gestureType] || gestureType?.replace('_', ' ') || "Unknown";
};

/**
 * Get color classes for a specific gesture type
 * @param {string} gestureType - The gesture type
 * @param {string} variant - Color variant (text, bg, border, gradient)
 * @returns {string} The CSS class string
 */
export const getGestureColor = (gestureType, variant = "text") => {
  const colors = GESTURE_COLORS[gestureType];
  if (!colors) return variant === "text" ? "text-gray-400" : "bg-gray-500";
  return colors[variant] || colors.text;
};

/**
 * Format gesture text with emoji
 * @param {string} gestureType - The gesture type
 * @param {boolean} includeEmoji - Whether to include the emoji
 * @returns {string} Formatted gesture text
 */
export const formatGestureText = (gestureType, includeEmoji = true) => {
  const emoji = includeEmoji ? `${getGestureEmoji(gestureType)} ` : "";
  const name = getGestureName(gestureType);
  return `${emoji}${name}`;
};

export default {
  GESTURE_EMOJIS,
  GESTURE_NAMES,
  GESTURE_COLORS,
  getGestureEmoji,
  getGestureName,
  getGestureColor,
  formatGestureText,
};
