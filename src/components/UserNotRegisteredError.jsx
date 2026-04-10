export default function UserNotRegisteredError() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h1 className="text-2xl font-bold text-destructive mb-2">User Not Registered</h1>
      <p className="text-muted-foreground max-w-md">
        Your account is not registered in our system. Please contact your administrator to gain access.
      </p>
    </div>
  );
}
