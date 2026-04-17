import { IdTagsContainer } from '@/features/drivers/containers/IdTagsContainer';

export const metadata = {
  title: 'ID Tag Management | CSMS',
  description: 'Manage RFID tags and access tokens for drivers.',
};

export default function IdTagsPage() {
  return <IdTagsContainer />;
}
