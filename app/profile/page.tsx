import ProfilePage from "@/components/profile/profile-page";
import WithVerification from "@/components/common/with-verification";

export default function Profile() {
  return (
    <WithVerification>
      <ProfilePage />
    </WithVerification>
  );
}
