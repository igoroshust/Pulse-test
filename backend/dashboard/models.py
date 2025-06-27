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
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    someint = models.IntegerField()

    def __str__(self):
        return f'{self.title}'

    class Meta:
        verbose_name = 'Тест'
        verbose_name_plural = 'Тест'
        db_table = 'test'