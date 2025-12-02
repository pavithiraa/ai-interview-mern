import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: 0,
    topicToFocus: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicToFocus } = formData;

    if (!role || !experience || !topicToFocus) {
      setError("Please fill all the required fields.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      //AI API to generate questions
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicToFocus,
          numberOfQuestions: 10,
        }
      );

      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions: generatedQuestions,
      });

      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data?.session?._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">
        Start a New Interview Journey
      </h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Fill out a few quick details and unlock your presonalized set of
        interview questions!
      </p>
      <form onSubmit={handleCreateSession} className="flex flex-col ga-3">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label="Target Role"
          placeholder="(e.g., Frontend Developer , UI/UX Designer, etc.)"
          type="text"
        />
        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange("experience", target.value)}
          label="Years of Experience"
          placeholder="(e.g., 1 years , 3 years , 5+ years)"
          type="Number"
        />
        <Input
          value={formData.topicToFocus}
          onChange={({ target }) => handleChange("topicToFocus", target.value)}
          label="Topics to Focus On"
          placeholder="(Comma-separated, e.g., React, Node.js, MongoDB)"
          type="text"
        />
        <Input
          value={formData.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label="Description"
          placeholder="(Any specific goals or notes for this session)"
          type="text"
        />

        {error && <p className="text-red-500 text-xs pb-2.5 pt-2.5">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full mt-2 py-2"
          disabled={isLoading}
        >
          {isLoading ? "creating..." : "Create Session"}
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;
