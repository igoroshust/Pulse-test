from django.db import models

class Information(models.Model):
    org_name = models.CharField(max_length=500, blank=True, verbose_name='Наименование организации')
    deep = models.IntegerField(verbose_name='Глубина окна')
    average = models.IntegerField(verbose_name='Среднее время ожидания по талону')
    active = models.IntegerField(verbose_name='Активные окна')

    def __str__(self):
        return f'{self.org_name}'

    class Meta:
        verbose_name = 'Информация'
        verbose_name_plural = 'Информация'

class Test(models.Model):
    """Тестовая модель (внешняя)"""
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    someint = models.IntegerField()

    def __str__(self):
        return f'{self.title}'

    class Meta:
        verbose_name = 'Тест'
        verbose_name_plural = 'Тест'

class Window(models.Model):
    window_id = models.IntegerField()
    active = models.IntegerField(verbose_name='Активность окна')
    department_id = models.IntegerField(verbose_name='Номер департамента')
    online = models.IntegerField(verbose_name='Онлайн ли окно')

    def __str__(self):
        return f'{self.window_id}'

    class Meta:
        verbose_name = 'Окно'
        verbose_name_plural = 'Окна'

class Talon(models.Model):
    talon_id = models.IntegerField()
    fio = models.CharField(verbose_name='ФИО заявителя')
    ser_day = models.TimeField(verbose_name='Дата резервирования')
    full_number = models.CharField(verbose_name='Полный номер талона')

    def __str__(self):
        return f'{self.talon_id}'

    class Meta:
        verbose_name = 'Талон'
        verbose_name_plural = 'Талоны'

class Work_time(models.Model):
    unit_id = models.IntegerField()
    description = models.CharField(verbose_name='Название и тип расписания')
    mon_prerecord_factor = models.IntegerField(verbose_name='Процент пред записи на понедельник')
    tue_prerecord_factor = models.IntegerField(verbose_name='Процент пред записи на вторник')
    wed_prerecord_factor = models.IntegerField(verbose_name='Процент пред записи на среду')
    thu_prerecord_factor = models.IntegerField(verbose_name='Процент пред записи на четверг')
    fri_prerecord_factor = models.IntegerField(verbose_name='Процент записи на пятницу')
    sat_prerecord_factor = models.IntegerField(verbose_name='Процент записи на субботу')

    def __str__(self):
        return f'{self.unit_id}'

    class Meta:
        verbose_name = 'Рабочее время'
        verbose_name_plural = 'Рабочее время'

class Department(models.Model):
    department_id = models.IntegerField(verbose_name='ID отдела')
    name = models.CharField(verbose_name='Имя отдела')
    description = models.CharField(verbose_name='Расшифровка')
    unit_id = models.IntegerField(verbose_name='ID офиса')

    def __str__(self):
        return f'{self.department_id}'

    class Meta:
        verbose_name = 'Отделы офиса'
        verbose_name_plural = 'Отделы офиса'

class Unit(models.Model):
    unit_id = models.IntegerField(verbose_name='ID офиса')
    name = models.CharField(verbose_name='Название офиса')
    short_name = models.CharField(verbose_name='Компактное название офиса')
    work_time_id = models.IntegerField(verbose_name='рабочее время офиса')
    pre_record_time_id = models.IntegerField(verbose_name='расписание пред записи')

    def __str__(self):
        return f'{self.unit_id}'

    class Meta:
        verbose_name = 'Офисы'
        verbose_name_plural = 'Офисы'

class Work_time_range(models.Model):
    work_time_range_id = models.IntegerField()
    time_from = models.CharField(verbose_name='Время начала интервала')
    time_to = models.CharField(verbose_name='Время конца интервала')
    mon = models.IntegerField(verbose_name='Интервал работает в ПН')
    tue = models.IntegerField(verbose_name='Интервал работает в ВТ')
    web = models.IntegerField(verbose_name='Интервал работает в СР')
    thu = models.IntegerField(verbose_name='Интервал работает в ЧТ')
    fri = models.IntegerField(verbose_name='Интервал работает в ПТ')
    sat = models.IntegerField(verbose_name='Интервал работает в СБ')
    sun = models.IntegerField(verbose_name='Интервал работает в ВС')
    unit_id = models.IntegerField(verbose_name='ID отдела')

    def __str__(self):
        return f'{self.work_time_range_id}'

    class Meta:
        verbose_name = 'Интервалы'
        verbose_name_plural = 'Интервалы'