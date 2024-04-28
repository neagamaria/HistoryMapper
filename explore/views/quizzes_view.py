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


# API endpoint for retrieving quiz questions with answers
class QuizAPIView(APIView):
    # create question based on question type
    @staticmethod
    def create_question(self, question_type, event, events):
        answers = list(['', '', '', ''])

        # select random position for right answer
        right_answer = random.randint(0, 2)

        if question_type == 1:
            question = f'Which event took place in {event.location} in {event.year} {event.era}?'
            answers[right_answer] = event.name
            other_answers = list(Event.objects.raw('''select * from 
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
            other_answers = list(Event.objects.raw('''select * from 
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

        # return {'question': question, 'right_answer': right_answer, 'answers': answers}
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
    def get(self, request):
        try:
            request_data = JSONParser().parse(request)
            return JsonResponse({'data': request_data['user']})
            user = User.objects.get(username=request['user'])

            return JsonResponse({'data': user.id})
            categories = Category.objects.all().order_by('id')

            quiz_history = QuizHistory.objects.raw('''SELECT * FROM explore_quizhistory 
                                                                  WHERE user_id = %s''',
                                                   [user.id])

            data = [{category.id: {'user_id': user.id, 'category_id': category.id,
                                   'last_score': quiz_history[0].last_score}
                    for category in categories}]
            return JsonResponse({'data': data}, safe=False)
        except QuizHistory.DoesNotExist:
            return JsonResponse({'status': status.HTTP_404_NOT_FOUND})

    # create a new quiz history for current quiz and user
    # or update an existing one
    def put(self, request):
        try:
            request_data = JSONParser().parse(request)
            user = User.objects.get(username=request_data['user'])
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
                QuizHistory.objects.get(id=quiz_history_id).update(last_score=request_data['last_score'])
            return JsonResponse({'status': status.HTTP_200_OK})

        except Exception as e:
            return JsonResponse({'error': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR})



