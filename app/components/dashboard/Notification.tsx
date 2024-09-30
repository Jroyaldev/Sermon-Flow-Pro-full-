// app/components/Dashboard/Notification.tsx

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
  }
  
  const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    return (
      <div className={`fixed bottom-4 right-4 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded shadow-lg`}>
        {message}
      </div>
    );
  };
  
  export default Notification;
  