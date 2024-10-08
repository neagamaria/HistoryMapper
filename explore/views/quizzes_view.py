import random
from django.http import JsonResponse
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from explore.models import Category, Event, QuizHistory
from django.contrib.auth.models import User


# API endpoint for retrieving all categories
class CategoriesAPIView(APIView):
    def get(self, request):
        try:
            categories = Category.objects.all().order_by('name')
            data = [{'id': category.id, 'name': category.name} for category in categories]
            return JsonResponse({'data': data, 'status': status.HTTP_200_OK})
        except Category.DoesNotExist:
            return JsonResponse({'status': 404})


# API endpoints for retrieving a category by name
class CategoryAPIView(APIView):
    def get(self, request, category_name):
        try:
            category_name = category_name.lower()
            category = Category.objects.raw('''SELECT * FROM explore_category WHERE LOWER(name) = %s''', [category_name])
            if category:
                category = category[0]
            else:
                return JsonResponse({'status': status.HTTP_404_NOT_FOUND})
            data = {'id': category.id, 'name': category.name}
            return JsonResponse({'data': data, 'status': status.HTTP_200_OK})
        except Category.DoesNotExist:
            return JsonResponse({'status': status.HTTP_404_NOT_FOUND})


# API endpoint for retrieving quiz questions with answers
class QuizAPIView(APIView):
    # create question based on question type
    @staticmethod
    def create_question(self, question_type, event, events):
        answers = list(['', '', '', ''])
        question = ''

        # select random position for right answer
        right_answer = random.randint(0, 2)

        if question_type == 1:
            question = f'Which event took place in {event.location} in {event.year} {event.era}?'
            answers[right_answer] = event.name
            other_answers = list(Event.objects.raw('''SELECT * FROM 
                                                    (SELECT id, name FROM explore_event
                                                    ORDER BY dbms_random.value)
                                                    WHERE rownum <= 3'''))
            j = 0
            for i in range(0, 4):
                if i != right_answer:
                    answers[i] = other_answers[j].name
                    j = j + 1
        elif question_type == 2:
            question = f'Where did {event.name} take place in {event.year} {event.era}?'
            answers[right_answer] = event.location
            other_answers = list(Event.objects.raw('''SELECT * FROM 
                                                       (SELECT id, location FROM explore_event
                                                       ORDER BY dbms_random.value)
                                                       WHERE rownum <= 3'''))
            j = 0
            for i in range(0, 4):
                if i != right_answer:
                    answers[i] = other_answers[j].location
                    j = j + 1

        elif question_type == 3:
            question = f'When did {event.name} take place?'
            answers[right_answer] = str(event.year) + event.era
            # create dates close to the actual date
            other_answers = list([diff + int(event.year) for diff in
                                  random.sample([v for v in range(-100, 100) if v != 0], 3)])
            j = 0
            for i in range(0, 4):
                if i != right_answer:
                    answers[i] = str(other_answers[j]) + event.era
                    j = j + 1

        return question, right_answer, answers

    def get(self, request, category_id):
        questions_list = []

        try:
            # get random events from the given category
            events = Event.objects.raw('''SELECT * FROM
                                        (SELECT id, name, location, era, EXTRACT(YEAR from event_date) as year
                                          FROM explore_event WHERE category_id = %s ORDER BY dbms_random.value)
                                        where rownum <= 10''', [category_id])
            index = 0

            # generate questions
            for event in events:
                # select type of question: 1 - guess name, 2 - guess location, 3 - guess date
                question_type = random.randint(1, 3)
                question, right_answer, answers = self.create_question(self, question_type, event, events)
                questions_list.append(
                    {'id': index, 'question': question, 'right_answer': right_answer, 'answers': answers})
                index += 1

            return JsonResponse({'data': questions_list, 'status': status.HTTP_200_OK}, safe=False)
        except Exception as e:
            return JsonResponse({'exception': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR})


class QuizHistoryAPIView(APIView):
    # get quiz histories for specific user
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)

            quiz_history = QuizHistory.objects.raw('''SELECT * FROM explore_quizhistory 
                                                                  WHERE user_id = %s''',
                                                   [user.id])

            data = [{qh.category_id: {'user_id': user.id, 'category_id': qh.category_id,
                                      'last_score': qh.last_score}
                     for qh in quiz_history}]
            return JsonResponse({'data': data}, safe=False)
        except QuizHistory.DoesNotExist:
            return JsonResponse({'status': status.HTTP_404_NOT_FOUND})

    # create a new quiz history for current quiz and user
    # or update an existing one
    def put(self, request, username):
        try:
            request_data = JSONParser().parse(request)
            user = User.objects.get(username=username)
            category_id = request_data['category_id']

            category = Category.objects.raw('''SELECT * FROM explore_category WHERE id= %s''', [category_id])

            quiz_history = QuizHistory.objects.raw('''SELECT * FROM explore_quizhistory 
                                                      WHERE user_id = %s and category_id = %s''',
                                                   [user.id, category[0].id])

            if len(list(quiz_history)) == 0:
                # add new quiz history to db
                new_quiz_history = QuizHistory(user_id=user.id, category_id=category[0].id,
                                               last_score=request_data['last_score'])
                new_quiz_history.save()
            else:
                # update existing quiz history
                quiz_history_id = quiz_history[0].id
                quiz_history = QuizHistory.objects.get(id=quiz_history_id)
                quiz_history.last_score = request_data['last_score']
                quiz_history.save()

                return JsonResponse({'data': request_data['last_score']})
            return JsonResponse({'status': status.HTTP_200_OK})

        except Exception as e:
            return JsonResponse({'error': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR})
