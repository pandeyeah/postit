from flask import Flask, request, jsonify
from scipy.sparse import csr_matrix
import pickle
import re
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
import nltk

# Ensure NLTK resources are downloaded
nltk.download('stopwords')

app = Flask(__name__)

# Load the sentiment analysis model and TF-IDF vectorizer
with open('clf.pkl', 'rb') as model_file:
    clf_model = pickle.load(model_file)

with open('tfidf.pkl', 'rb') as tfidf_file:
    tfidf_vectorizer = pickle.load(tfidf_file)

# Load stopwords
stopwords_set = set(stopwords.words('english'))

# Preprocessing function
def preprocessing(text):
    # Remove HTML tags
    text = re.sub(r'<[^>]*>', '', text)

    # Extract and append emojis
    emoticon_pattern = re.compile(r'[:;=Xx8][\-o\*\']?[\)\(DpP/\|Oo3]')
    emojis = emoticon_pattern.findall(text)
    text = re.sub(r'[\W_]+', ' ', text.lower()) + ' '.join(emojis).replace('-', '')

    # Stemming and removing stopwords
    porter = PorterStemmer()
    text = [porter.stem(word) for word in text.split() if word not in stopwords_set]

    return " ".join(text)

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    try:
        # Get the tweet text from the request
        data = request.get_json()
        tweet_text = data.get('text', '')

        if not tweet_text:
            return jsonify({'error': 'No text provided'}), 400

        # Preprocess the text
        preprocessed_text = preprocessing(tweet_text)

        # Transform the text using the TF-IDF vectorizer
        text_vectorized = tfidf_vectorizer.transform([preprocessed_text])

        # Predict sentiment using the loaded model
        sentiment = clf_model.predict(text_vectorized)[0]

        # Convert NumPy int64 to native Python int
        sentiment = int(sentiment)

        # Return the sentiment result
        return jsonify({'sentiment': sentiment})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
