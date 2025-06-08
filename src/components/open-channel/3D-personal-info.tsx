import React from "react";

interface PersonalInfo {
  email: string;
  phone: string;
  location: {
    street: { number: number; name: string };
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  dob: { date: string };
}

interface PersonalInfoCardProps {
  isOpen: boolean;
  onClose: () => void;
  editor: {
    name: string;
    personalInfo: PersonalInfo;
  } | null;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  if (!isOpen || !editor) return null;

  const { personalInfo } = editor;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{editor.name}</h2>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {personalInfo.email}
          </p>
          <p>
            <strong>Phone:</strong> {personalInfo.phone}
          </p>
          <p>
            <strong>Address:</strong> {personalInfo.location.street.number}{" "}
            {personalInfo.location.street.name}, {personalInfo.location.city},{" "}
            {personalInfo.location.state}, {personalInfo.location.country},{" "}
            {personalInfo.location.postcode}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(personalInfo.dob.date).toLocaleDateString()}
          </p>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
