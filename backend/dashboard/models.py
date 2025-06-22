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

# class Windows(models.Model):
#     organization_id = models.OneToOneField(Organizations, on_delete=models.CASCADE)
#     deep = models.IntegerField(verbose_name='Глубина окна')
#     average = models.IntegerField(verbose_name='Среднее время ожидания по талону')
#     active = models.BooleanField(verbose_name='Активность окна')