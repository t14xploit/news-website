import React, { useState } from "react";
import Image from "next/image";
import PersonalInfoCard from "./3D-personal-info";

interface PersonalInfo {
  email: string;
  phone: string;
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  dob: {
    date: string;
  };
}

interface MlProfile {
  communicationStyle: string;
  intellectualDiversity: number;
  innovationCapacity: number;
}

interface Editor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  expertise: string[];
  followers: number;
  aiRank: number;
  mlProfile: MlProfile;
  personalInfo: PersonalInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
}

interface EditorListProps {
  editors: Editor[];
}

interface EditorListProps {
  editors: Editor[];
}

const EditorList: React.FC<EditorListProps> = ({ editors }) => {
  const [selectedEditor, setSelectedEditor] = useState<Editor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditorClick = (editor: Editor) => {
    setSelectedEditor(editor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEditor(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {editors.map((editor) => (
        <div
          key={editor.id}
          className="p-4 border rounded-lg cursor-pointer hover:shadow-md"
          onClick={() => handleEditorClick(editor)}
        >
          <Image
            src={editor.avatar}
            alt={editor.name}
            className="w-16 h-16 rounded-full"
          />
          <h3 className="text-lg font-semibold">{editor.name}</h3>
          <p className="text-sm text-gray-600">{editor.bio}</p>
        </div>
      ))}
      <PersonalInfoCard
        isOpen={isModalOpen}
        onClose={closeModal}
        editor={selectedEditor}
      />
    </div>
  );
};

export default EditorList;
