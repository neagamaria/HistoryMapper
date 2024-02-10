from django.http import JsonResponse
from rest_framework.views import APIView
from explore.models import Question, Quiz


# API endpoint for retrieving all quizzes from the database
class QuizzesAPIView(APIView):
    @staticmethod
    def get(request):
        quizzes_number = Quiz.objects.count()
        quizzes = Quiz.objects.all()

        # data = {'number': quizzes_number, 'quizzes': {'title': quiz.title for quiz in quizzes}}
        data = {'number': quizzes_number, 'quizzes': [{'id': quiz.id, 'title': quiz.title} for quiz in quizzes]}

        return JsonResponse({'data': data})


# API endpoint for retrieving all questions from a quiz in the database
class QuestionsAPIView(APIView):
    @staticmethod
    def get(request, quiz_id):
        # questions = Question.objects.raw('''SELECT * FROM explore_question q WHERE q.quiz_id =  %s''', [quiz_id])
        questions = Question.objects.filter(quiz_id=quiz_id)
        data = [{'description': question.description, 'answer1': question.answer1, 'answer2': question.answer2,
                 'answer3': question.answer3, 'answer4': question.answer4, 'correct_answer': question.correct_answer}
                for question in questions]

        return JsonResponse({'data': data})
