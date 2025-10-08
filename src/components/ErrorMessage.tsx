type ErrorMessageProps = {
  message?: string;
};
export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return <p className='text-sm text-red-500'>{message}</p>;
}
