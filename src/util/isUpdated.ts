export default function isUpdated(createdAt: Date, updatedAt: Date) {
  return createdAt.toString() !== updatedAt.toString();
}
