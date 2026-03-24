import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('버튼 텍스트를 렌더링한다', () => {
    render(<Button>저장</Button>);

    expect(
      screen.getByRole('button', {
        name: '저장',
      })
    ).toBeInTheDocument();
  });

  it('클릭 시 핸들러를 호출한다', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>저장</Button>);

    await user.click(
      screen.getByRole('button', {
        name: '저장',
      })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태를 반영한다', () => {
    render(<Button disabled>저장</Button>);

    expect(
      screen.getByRole('button', {
        name: '저장',
      })
    ).toBeDisabled();
  });
});
