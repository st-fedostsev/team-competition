
import '../../styles/Button.css'

export function NameButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-midle" onClick={onClick}>
      <p className='button-text button-text-small'>
        Найти команду
      </p>
    </button>
  );
}

export function CreatePlusButton() { 
  return ( 
    <div> 
      <button className="button button-small"> 
      <span className='button-text button-text-small'>  
        Создать + 
      </span> 
    </button> 
    </div> 
  ); 
}

export function CreateButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-small drop-shadow" onClick={onClick}> 
    <p className='button-text button-text-small'> 
      Создать
    </p>
    </button>
  );
}

export function SendReportButton({ onClick }: ButtonProps) {
  return (
    <button className="button button-small drop-shadow" onClick={onClick}>
      <p className="button-text button-text-small">
        Отправить отчёт
      </p>
    </button>
  );
}
export function SendButton() {
  return (
    <button className="send-button">
      Отправить
    </button>
  );
}

export function CancelButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-small drop-shadow" onClick={onClick}> 
    <p className='button-text button-text-small'> 
      Отмена
    </p>
    </button>
  );
}

export function CheckInButton() {
  return (
    <button className="check-in-button">
      Check-in
    </button>
  );
}

export function StudentButton({ onClick }: ButtonProps) { 
  return ( 
    <button className="button button-big drop-shadow" onClick={onClick}> 
    <p className='button-text button-text-big'> 
      Студент 
      </p>   
    </button> 
  ); 
}

export function AdminButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-big drop-shadow" onClick={onClick}>
      <p className='button-text button-text-big'> 
        Администратор
      </p>   
    </button>
  );
}

export function RegisterButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-big drop-shadow" onClick={onClick}>
      <p className='button-text button-text-big'> 
        Зарегистрироваться
      </p>   
    </button>
  );
}

export function LoginButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-big drop-shadow"onClick={onClick}>
      <p className='button-text button-text-big'> 
        Войти
      </p>
    </button>
  );
}

export function JoinButton() {
  return (
    <button className="join-button">
      Вступить
    </button>
  );
}

export function ApplicationSentButton() {
  return (
    <button className="application-sent-button">
      Заявка отправлена
    </button>
  );
}

export function CreateEventButton() {
  return (
    <button className="create-event-button">
      Создать мероприятие+
    </button>
  );
}

export function CreateChallengeButton() {
  return (
    <button className="create-challenge-button">
      Создать челлендж+
    </button>
  );
}

export function CreateSletter({ onClick }: ButtonProps) { 
  return (
    <button className="button button-big drop-shadow"onClick={onClick}>
      <p className='button-text button-text-big'> 
        Создать рассылку+
      </p>
    </button>
  );
}

export function PostAnnouncementButton({ onClick }: ButtonProps) {
  return (
    <button className="button button-midle drop-shadow" onClick={onClick}>
      <p className="button-text button-text-small">
        Опубликовать объявление +
      </p>
    </button>
  );
}


export function ReplyButton({ onClick }: ButtonProps) {
  return (
    <button className="button button-small drop-shadow" onClick={onClick}>
      <p className="button-text button-text-small">
        Откликнуться
      </p>
    </button>
  );
}

export function PublishButton() {
  return (
    <button className="publish-button">
      Опубликовать
    </button>
  );
}
