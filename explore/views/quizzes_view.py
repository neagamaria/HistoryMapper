import random
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from explore.models import Category, Event


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
        answers = [] * 4
        # select random position for right answer
        right_answer = random.randint(0, 2)

        if question_type == 1:
            question = f'Which event took place in {event.location} on {event.year} {event.era}'
            answers[right_answer] = event.name
            other_answers = list(Event.objects.raw('''select * from 
                                                    (SELECT id, name FROM explore_event
                                                    ORDER BY dbms_random.value)
                                                    WHERE rownum <= 3'''))
            j = 0
            for i in range(0, 3):
                if i != right_answer:
                    answers[i] = other_answers[j].name
                    j = j + 1
        if question_type == 2:
            question = f'Where did {event.name} take place on {event.year} {event.era}?'
            answers[right_answer] = event.location
            other_answers = list(Event.objects.raw('''select * from 
                                                       (SELECT id, location FROM explore_event
                                                       ORDER BY dbms_random.value)
                                                       WHERE rownum <= 3'''))
            j = 0
            for i in range(0, 3):
                if i != right_answer:
                    answers[i] = other_answers[j].name
                    j = j + 1

        else:
            question = f'When did {event.name} take place?'
            answers[right_answer] = event.year + event.era
            # create dates close to the actual date
            other_answers = [diff + int(event.year) for diff in
                             random.sample(random.choice([v for v in range(-100, 100) if v != 0]), 3)]
            j = 0
            for i in range(0, 3):
                if i != right_answer:
                    answers[i] = str(other_answers[j]) + event.era
                    j = j + 1

        return {'question': question, 'right_answer': right_answer, 'answers': answers}

    def get(self, request, category_id):
        questions_list = []
        try:

            # get random events from the given category
            events = Event.objects.raw('''SELECT * FROM
                                        (SELECT id, name, location, era, EXTRACT(YEAR from event_date) as year
                                          FROM explore_event WHERE category_id = %s ORDER BY dbms_random.value)
                                        where rownum <= 10''', [category_id])
            # generate questions
            for event in events:
                # select type of question: 1 - guess name, 2 - guess location, 3 - guess date
                question_type = random.randint(1, 3)

                question = self.create_question(self, question_type, event, events)
                questions_list.append(question)

            return JsonResponse({'data': questions_list, 'status': status.HTTP_200_OK})
        except Exception as e:
            return JsonResponse({'status': status.HTTP_500_INTERNAL_SERVER_ERROR})
