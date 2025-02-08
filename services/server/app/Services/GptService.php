<?php

namespace App\Services;

use App\Models\Video;

use App\Enums\GptPropmtsEnum;
use App\Enums\HttpStatusEnum;
use App\Enums\JsonSchemesEnum;
use App\Enums\WhisperFailedEnum;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

use GuzzleHttp\Client;

class GptService
{
    const TRANSCRIPTION = "
          in the next 17 minutes I will give you an overview of the most important machine learning algorithms to help you decide which one is right for your problem my name is Tim and I have been a data scientist for over 10 years and taught all of these algorithms to hundreds of students in real life machine learning boot camps there is a simple strategy for picking the right algorithm for your problem in 17 minutes you will know how to pick the right one for any problem and get a basic intuition of each algorithm and how they
          
          relate to each other my goal is to give as many of you as possible an intuitive understanding of the major machine learning algorithms to make you stop feeling overwhelmed according to Wikipedia machine learning is a field of study in artificial intelligence concerned with the development and study of statistical algorithms that can learn from data and generalize to unseen data and thus perform tasks without explicit instructions much of the recent advancements in AI are driven by neural networks which I hope to give you an
          
          intuitive understanding of by the end of this video Let's divide machine learning into its subfields generally machine learning is divided into two areas supervised learning and unsupervised learning supervised learning is when we have a data set with any number of independent variables also called features or input variables and a dependent variable also called Target or output variable that is supposed to be predicted we have a so-called training data set where we know the True Values for the output variable also called
          
          labels that we can train our algorithm on to later predict the output variable for new unknown data examples could be predicting the price of a house the output variable based on features of the house say square footage location year of construction Etc categorizing an object as a cat or a dog the output variable or label based on features of the object say height weight size of the ears color of the eyes Etc unsupervised learning is basically any learning problem that is not supervised so where
          
          no truth about the data is known so where a supervised algorithm would be like showing a little kid what a typical cat looks like and what a typical dog looks like and then giving it a new picture and asking it what animal it sees an unsupervised algorithm would be giving a kid with no idea of what cats and dogs are a pile of pictures of animals and asking it to group by similarity without any further instructions examples of unsupervised problems might be to sort all of your emails into three unspecified categories
          
          which you can then later inspect and name as you wish the algorithm will decide on its own how it will create those categories also called clusters let's start with supervised learning arguably the bigger and more important branch of machine learning there are broadly two subcategories in regression we want to predict a continuous numeric Target variable for a given input variable using the example from before it could be predicting the price of a house given any number features of a house and determining their relationship
          
          to the final price of the house we might for example find out that square footage is directly proportional to the price linear dependence but that the age of the house has no influence on the price of the house in classification we try to assign a discrete categorical label also called a class to a data point for example we may want to assign the label spam or no spam to an email based on its content sender and so on but we could also have more than two classes for example junk primary social promotions
          
          and updates as Gmail does by default now let's dive into the actual algorithms starting with the mother of all machine learning algorithms linear regression in general supervised learning algorithms try to determine the relationship between two variables we try to find the function that Maps one to the other linear regression in its simplest form is trying to determine a linear relationship between two variables namely the input and the output we want to fit a linear equation to the data by minimizing the sum of squares of the
          
          distances between data points and the regression Line This simply minimizes the average distance of the real data to our predictive model in this case the regression line and should therefore minimize prediction errors for new data points a simple example of a linear relationship might be the height and shoe size of a person where the regression fit might tell us that for every one unit of shoe size increase the person will be on average 2 Ines taller you can make your model more complex and fit multi-dimensional data to an output
          
          variable in the example of the shoe size you might for example want to include the gender age and ethnicity of the person to get an even better model many of the very fancy machine learning algorithms including neural networks are just extensions of this very simple idea as I will show you later in the video logistic regression is a variant of linear regression and probably the most basic classification algorithm instead of fitting a line to two numerical variables with a presumably linear relationship you now try to predict a
          
          categorical output variable using categorical or numerical input variables let's look at an example we now want to predict one of two classes for example the gender of a person based on height and weight so a linear regression wouldn't make much sense anymore instead of fitting a line to the data we now fit a so-called sigmoid function to the data which looks like this the equation will now not tell us about a linear relationship between two variables but will now conveniently tell us the probability of a data point falling into
          
          a certain class given the value of the input variable so for example the likelihood of an adult person with a height of 180 cm being a man would be 80% this is completely made up of course the K nearest neighbors algorithm or KNN is a very simple and intuitive algorithm that can be used for both regression and class ification it is a so-called non-parametric algorithm the name means that we don't try to fit any equations and thus find any parameters of a model so no true model fitting is necessary
          
          the idea of KNN is simply that for any given new data point we will predict the target to be the average of its K nearest neighbors while this might seem very simple this is actually a very powerful predictive algorithm especially when relationships are more complicated than a simple linear relationship in a classification example we might say that the gender of a person will be the same as the majority of the five people closest in weight and height to the person in question in a regression example we might say that the weight of
          
          a person is the average weight of the three people closest in height and of chest circumference this makes a ton of intuitive sense you might realize that the number three seems a bit arbitrary and it is K is called a hyperparameter of the algorithm and choosing the right K is an art choosing a very small number of K say one or two will lead to your model predicting your training data set very well but not generalizing well to unseen data this is called overfitting choosing a very large number say 1,000
          
          will lead to a worst fit over overall this is called underfitting the best number is somewhere in between and Depends a lot on the problem at hand methods for finding the right hyperparameters include cross validation but are beyond the scope of this video support Vector machine is a supervised machine learning algorithm originally designed for classification tasks but it can also be used for regression tasks the core concept of the algorithm is to draw a decision boundary between data points that separates data points of the
          
          training set as well as possible as the name suggests a new unseen data point will be classified according to where it falls with respect to the decision boundary let's take this arbitrary example of trying to classify animals by their weight and the length of their nose in this simple case of trying to classify cats and elephants the decision boundary is a straight line the svm algorithm tries to find the line that separates the classes with the largest margin possible that is maximizing the space between the different classes this
          
          makes the decision boundary generalize well and less sensitive to noise and outliers in the training data the so-called support vectors are the data points that sit on the edge of the margin knowing the support vectors is enough to classify new data points which often makes the algorithm very memory efficient one of the benefits of SPM is that it is very powerful in high Dimensions that is if the number of features is large compared to the size of the data in those higher dimensional cases the decision boundary is called a
          
          hyperplane another feature that makes svms extremely powerful is the use of so-called kernel functions which allow for the identification of Highly complex nonlinear decision boundaries kernel functions are an implicit way to turn your original features into new more complex features using the so-called kernel trick which is beyond the scope of this video this allows for efficient creation of nonlinear decision boundaries by creating complex new features such as weight divided by height squared also called the BMI this
          
          is called implicit feature engineering neural networks take the idea of implicit feature engineering to the next level as I will explain later possible kernel functions for svms are the linear the polinomial the RBF and the sigmoid kernel another fairly simple classifier is the naive Bas classifier that gets its name from B theorem which looks like this I believe it's easiest to understand naive Bay with an example use case that it is often used for spam filters we can train our algorithm with a number of spam and non-spam emails and
          
          count the occurrences of different words in each class and thereby calculate the probability of certain words appearing in spam emails and non-spam emails we can then quickly classify a new email based on the words it contains by by using base theorem we simply multiply the different probabilities of all words in the email together this algorithm makes the false assumption that the probabilities of the different words appearing are independent of each other which is why we call this classifier naive this makes it very computation
          
          Ally efficient while still being a good approximation for many use cases such as spam classification and other text-based classification tasks decision trees are the basis of a number of more complex supervised learning algorithms in its simplest form a decision tree looks somewhat like this the decision tree is basically a series of yes no questions that allow us to partition a data set in several Dimensions here is an example decision tree for classifying people into high and lowrisk patients for heart
          
          attacks the goal of the decision tree algorithm is to create so-called Leaf nodes at the bottom of the tree that are as pure as possible meaning instead of randomly splitting the data we try to find splits that lead to the resulting groups or leaves to be as pure as possible which is to say that as few data points as possible are misclassified while this might seem like a very basic and simple algorithm which it is we can turn it into a very powerful algorithm by combining many decision trees together combining many
          
          simple models to a more powerful complex model is called an ensemble algorithm one form of ensembling is bagging where we train multiple models on different subsets of the training data using a method called bootstrap a famous version of this idea is called a random Forest where many decision trees vote on the classification of your data by majority vote of the different trees in the random Forest random forests are very powerful estimators that can be used both for classification and regression the randomness comes from
          
          randomly excluding features for different trees in the forest which prevents overfitting and makes it much more robust because it removes correlation between the trees another type of Ensemble method is called boosting where instead of running many decision trees in parallel like for random forests we train models in sequence where each model focuses on fixing the errors made by the previous model we combine a series of weak models in sequence thus becoming a strong model because each sequential model tries to
          
          fix the errors of the previous model boosted trees often get to higher accuracies than random forests but are also more prone to overfitting its sequential nature makes it slower to train than random forests famous examples of boosted trees are Ada boost gradient boosting and XG boost the details of which are beyond the scope of this video now let's get to the reigning king of AI neural networks to to understand neural networks let's look at logistic regression again say we have a number of features and are trying to
          
          predict a target class the features might be pixel intensities of a digital image and the target might be classifying the image as one of the digits from 0 to 9 now for this particular case you might see why this might be difficult to do with logistic regression because say the number one doesn't look the same when different people write it and even if the same person writes it several times it will look slightly different each time and it won't be the exact same pixels illuminated for every instance of the
          
          number one all of the instances of the number one have commonality however like they all have a dominating vertical line and usually no Crossing Lines as other digits might have and usually there are no circular shapes in the number one as there would be in the number eight or or nine however the computer doesn't initially know about these more complex features but only the pixel intensities we could manually engineer these features by measuring some of these things and explicitly adding them as new
          
          features but artificial neural networks similarly to using a kernel function with a support Vector machine are designed to implicitly and automatically design these features for us without any guidance from humans we do this by adding additional layers of unknown variables between the input and output variables in its simplest form this is called a single layer percep chop which is basically just a multi-feature regression task now if we add a hidden layer the hidden variables in the middle layer represent some hidden unknown
          
          features and instead of predicting the target variable directly we try to predict these hidden features with our input features and then try to predict the target variables with our new hidden features in our specific example we might be able to say that every time several pixels are illuminated next to each other they represent a horizontal line which can be a new feature to try and predict the digit in question even though we never explicitly defined a feature called horizontal line This is a
          
          much simplified view of what is actually going on but hopefully this gets the point across we don't usually know what the hidden features represent we just train the neural network to predict the final Target as well as possible the hidden features we can Design This Way are limited in the case of the single hidden layer but what if we add a layer and have the hidden layer predict another hidden layer what if we now had even more layers this is called Deep learning and can result in very complex
          
          hidden features so that might represent all kinds of complex information in the pictures like the fact that there is a face in the picture however we will usually not know what the hidden features mean we just know that they result in good predictions all we have talked about so far is supervised learning where we wanted to predict a specific Target variable using some input variables however sometimes we don't have anything specific to predict and just want to find some underlying structure in our data that's where
          
          unsupervised learning comes in a very common unsupervised problem is clustering it's easy to confuse clustering with classification but they are conceptually very different classification is when we know the classes we want to predict and have training data with true labels available shown as colors here like pictures of cats and dogs clustering is when we don't have any labels and want to find unknown clusters just by looking at the overall structure of the data and trying to find potential clusters in the data
          
          for example we might look at a two-dimensional data set that looks like this any human will probably easily see three clusters here but it's not always as straightforward as your data might might also look like this we don't know how many clusters there are because the problem is unsupervised the most famous clustering algorithm is called K means clustering just like for KNN K is a hyperparameter and stands for the number of clusters you are looking for finding the right number of clusters again is an
          
          art and has a lot to do with your specific problem and some trial and error in domain knowledge might be required this is beyond the scope of this video K means is very simple you start by randomly selecting centers for your K clusters and assigning all data points to the cluster center closest to them the Clusters here are shown in blue and green you then recalculate the cluster centers based on the data points now assigned to them you can see the centers moving closer to the actual clusters you then assign the data points
          
          again to the new cluster centers followed by recalculating the cluster centers you repeat this process until the centers of the Clusters have stabilized while K means is the most famous and most common clustering algorithm other algorithms exist including some where you don't need to specify the number of clusters like hierarchical clustering and DB scan which can find clusters of arbitrary shape but I won't discuss them here the last type of algorithm I will leave you with is dimensionality reduction the
          
          idea of dimensionality reduction is to reduce the number of features or dimensions of your data set keeping as much information as possible usually this group of algorithms does this by finding correlations between existing features and removing potentially redundant Dimensions without losing much information for example do you really need a picture in high resolution to recognize the airplane in the picture or can you reduce the number of pixels in the image as such dimensionality reduction will give you information
          
          about the relationships within your existing features and it can also be used as a pre-processing step in your supervised learning algorithm to reduce the number of features in your data set and make the algorithm more efficient and robust an example algorithm is principal component analysis or PCA let's say we are trying to predict types of fish based on several features like length height color and number of teeth when looking at the correlations of the different features we might find that height and length are strongly
          
          correlated and including both both won't help the algorithm much and might in fact hurt it by introducing noise we can simply include a shape feature that is a combination of the two this is actually extremely common in large data sets and allows us to reduce the number of features dramatically and still get good results PCA does this by finding the directions in which most variance in the data set is retained in this example the direction of most variant is a diagonal this is called the first principal
          
          component or PC and can become our new shape feature the second principal component is orthogonal to the first and only explains a small fr C of the variant of the data set and can thus be excluded from our data set in this case in large data sets we can do this for all features and rank them by explain variants and exclude any principal components that don't contribute much to the variant and thus wouldn't help much in our ml model this was all common machine learning algorithms explained if you are overwhelmed and don't know which
          
          algorithm you need here is a great cheat sheet by syit learn that will help you decide which algorithm is right for which type of problem if you want a road map on how to learn machine learning check out my video on that
          ";

    public function getTranscription(Video $video): mixed
    {
        try {
            return self::TRANSCRIPTION;

            if (is_null($video)) {
                return HttpStatusEnum::NOT_FOUND;
            }
            $output = null;
            if (Storage::disk(config('filesystems.storage_service'))->exists($video->video_name)) {
                $audioName = $video->audio_name;
                ini_set('max_execution_time', config('app.max_execution_time'));
                $audioPath = storage_path("app/public/{$audioName}");

                $command = config('app.transcription_from_whisper_python_script') . ' ' . $audioPath . ' ' . config('app.openai_api_key');
                $output = shell_exec($command);

                if ($output == "error" || is_null($output)) {
                    Log::error('Error in transcription python script');
                    return null;
                }
            }
            Log::alert($output);
            return $output;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getSummary(string|null $transcription)
    {
        try {
            // return 'summary';

            if ($transcription == WhisperFailedEnum::TRANSCRIPTION_FAILED->value) {
                return WhisperFailedEnum::SUMMARY_FAILED->value;
            }
            $prompt = GptPropmtsEnum::GET_SUMMARY_PROMPT->value . $transcription;

            $summary = $this->getGptResponse($prompt);

            Log::alert('SUMMARY: ' . $summary);
            return $summary;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function generateQuiz(string|null $summary)
    {
        try {
            // return 'quiz';
            if ($summary == WhisperFailedEnum::SUMMARY_FAILED->value) {
                return WhisperFailedEnum::QUIZ_FAILED->value;
            }

            $quiz = $this->getGptResponse(GptPropmtsEnum::GENERATE_QUIZ_PROMPT->value . $summary, [], JsonSchemesEnum::QUIZ_JSON_SCHEMA);
            Log::alert('QUIZ ' . $quiz);

            $quiz = trim($quiz);
            $quiz = preg_replace('/^```php\s*/', '', $quiz); // Remove the opening '```php'
            $quiz = preg_replace('/\s*```$/', '', $quiz); // Remove the closing '```'

            // Step 2: Escape single quotes inside string values to prevent breaking
            $quizString = preg_replace_callback("/'([^']+)'/", function ($matches) {
                // Escape any single quotes within the string
                return "'" . str_replace("'", "\'", $matches[1]) . "'";
            }, $quiz);

            // Step 3: Replace single quotes around values (but not keys) with double quotes
            $quizString = preg_replace("/'(\w+)'(\s*=>\s*)'([^']+)'/", '"$1"$2"$3"', $quizString);

            // Step 4: Use eval() to parse the string into an actual PHP array
            $quizArray = null;
            eval('$quizArray = ' . $quizString . ';');

            return $quizArray;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getChatResponse(string $message, array $chatHistory)
    {
        try {
            // return 'chat response';

            return $this->getGptResponse($message, $chatHistory);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getMindMapJson(string $summary)
    {
        // return json_encode(self::DEMO_MIND_MAP);

        $mindMap = $this->getGptResponse(GptPropmtsEnum::GET_MIND_MAP->value . $summary, [], JsonSchemesEnum::MIND_MAP_SCHEMA);
        Log::alert('MIND MAP: ' . $mindMap);
        if (preg_match('/```json\n(.*?)\n```/s', $mindMap, $matches)) {
            $jsonMindMap = $matches[1];
            return json_encode($jsonMindMap);
        }
        return json_encode($mindMap);
    }

    // ------------------- private Functions -------------------

    private function getGptResponse(string $prompt, array $chatHistory = [], array $jsonSchema = [])
    {
        try {
            $client = new Client();

            $messages = [
                ['role' => 'system', 'content' => 'You are a helpful assistant.'],
            ];

            if (!empty($chatHistory)) {
                foreach ($chatHistory as $message) {
                    $messages[] = [
                        'role' => $message['role'],
                        'content' => $message['content'],
                    ];
                }
            }

            $messages[] = [
                'role' => 'user',
                'content' => $prompt,
            ];

            $bodyRequest = [
                'headers' => [
                    'Authorization' => 'Bearer ' . config('app.openrouter_api_key'),
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    "model" => config('app.deepseek_model'),
                    'messages' => $messages,
                    // 'max_tokens' => config('app.openai_max_tokens'),
                    // 'temperature' => config('app.openai_temperature'),
                ],
                'verify' => false,
                'timeout' => 3000,
            ];

            if (!empty($jsonSchema)) {
                $bodyRequest['json']['response_format'] = ['type' => 'json_schema', 'json_schema' => $jsonSchema];
            }

            $response = $client->post(config('app.openrouter_base_uri') . 'chat/completions', $bodyRequest);

            $responseData = json_decode($response->getBody(), true);
            Log::alert($responseData);
            $answer = $responseData['choices'][0]['message']['content'];

            return $answer;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }
}
