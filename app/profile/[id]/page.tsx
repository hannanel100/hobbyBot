// display hobbies saved to the db according to id

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div>
      <h1>Profile Page</h1>
      <p>id: {id}</p>
    </div>
  );
};

export default ProfilePage;
