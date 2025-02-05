export const DATA = {
  title: "Machine Learning Overview",
  nodes: [
    {
      id: 1,
      label: "Definition",
      description:
        "Machine learning enables computers to learn from data rather than explicit instructions.",
    },
    {
      id: 2,
      label: "History",
      description:
        "The term was coined by Arthur Samuel in 1959 during his work at IBM on AI for checkers.",
    },
    {
      id: 3,
      label: "Applications",
      description:
        "Used in everyday products for classifying data and predicting outcomes, like stock prices or video recommendations.",
      children: [
        {
          id: 31,
          label: "Classification",
          description:
            "Assigning data into categories, such as spam detection in emails.",
        },
        {
          id: 32,
          label: "Prediction",
          description:
            "Forecasting future data points, like predicting stock prices.",
        },
      ],
    },
    {
      id: 4,
      label: "Data Importance",
      description:
        "Quality data is crucial; 'garbage in, garbage out' emphasizes the need for clean, representative data.",
    },
    {
      id: 5,
      label: "Feature Engineering",
      description:
        "Data scientists transform raw data into features for better algorithm performance.",
    },
    {
      id: 6,
      label: "Algorithm Selection",
      description:
        "Various algorithms exist, from simple models to complex neural networks for tasks like image recognition.",
    },
    {
      id: 7,
      label: "Model Deployment",
      description:
        "The final model predicts outcomes and can be deployed on devices or in the cloud for real-world applications.",
      children: [
        {
          id: 71,
          label: "TEST 1",
          description:
            "Machine learning mimics organic learning, allowing systems to adapt and improve through experience rather than fixed programming.",
        },
        {
          id: 72,
          label: "TEST2",
          description:
            "Arthur Samuel's foundational work laid the groundwork for modern AI, illustrating how long-standing research has evolved into everyday technologies.",
        },
      ],
    },
    {
      id: 8,
      label: "Key Insights",
      children: [
        {
          id: 81,
          label: "Learning from Data",
          description:
            "Machine learning mimics organic learning, allowing systems to adapt and improve through experience rather than fixed programming.",
        },
        {
          id: 82,
          label: "Historical Context",
          description:
            "Arthur Samuel's foundational work laid the groundwork for modern AI, illustrating how long-standing research has evolved into everyday technologies.",
        },
        {
          id: 83,
          label: "Classification and Prediction",
          description:
            "Understanding the two main functions of machine learning—classification and prediction—highlights its utility in decision-making across industries.",
        },
        {
          id: 84,
          label: "Data Quality",
          description:
            "The emphasis on data quality underscores the critical role of data preparation, reminding us that insights are only as good as the data we feed into algorithms.",
        },
        {
          id: 85,
          label: "Role of Feature Engineering",
          description:
            "Feature engineering is essential for transforming raw data into valuable inputs for algorithms, showcasing the importance of data scientists in the machine learning pipeline.",
        },
        {
          id: 86,
          label: "Algorithm Complexity",
          description:
            "The range of algorithms available allows for tailored solutions to specific problems, from simple linear models to advanced neural networks, catering to varying data complexities.",
        },
        {
          id: 87,
          label: "Real-World Applications",
          description:
            "Deploying machine learning models in practical settings demonstrates its transformative potential across industries, emphasizing the shift from theory to tangible benefits for society.",
        },
      ],
    },
  ],
};
